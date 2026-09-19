import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new s3.Bucket(this, "Dnd5eApiImagesBucket", {
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: true,
        ignorePublicAcls: true,
        blockPublicPolicy: false,
        restrictPublicBuckets: false,
      }),
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    new s3.Bucket(this, "Dnd5eApiCoBucket", {
      encryption: s3.BucketEncryption.S3_MANAGED,
      websiteRedirect: {
        hostName: "www.dnd5eapi.co",
        protocol: s3.RedirectProtocol.HTTPS,
      },
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Reference the active ACM certificate in us-east-1 for CloudFront
    const certificate = acm.Certificate.fromCertificateArn(
      this,
      "ActiveAcmCertificateForCloudFront",
      "arn:aws:acm:us-east-1:911448592982:certificate/b08418e0-443b-408d-9094-ba6e716ede2b"
    );

    // Reference the existing Route 53 Hosted Zone
    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      "ImportedHostedZone",
      {
        hostedZoneId: "ZDMYNHE4G4KLW",
        zoneName: "dnd5eapi.co",
      }
    );

    // Define the Response Headers Policy to match the existing configuration
    const customResponseHeadersPolicy = new cloudfront.ResponseHeadersPolicy(
      this,
      "Managed-CORS-With-Preflight",
      {
        responseHeadersPolicyName: "DndAppResponseHeadersPolicy",
        comment:
          "Allows all origins for CORS requests, including preflight requests",
        corsBehavior: {
          accessControlAllowOrigins: ["*"],
          accessControlAllowHeaders: ["*"],
          accessControlAllowMethods: [
            "GET",
            "HEAD",
            "PUT",
            "POST",
            "PATCH",
            "DELETE",
            "OPTIONS",
          ],
          accessControlAllowCredentials: false,
          accessControlExposeHeaders: ["*"],
          originOverride: false,
        },
      }
    );

    // Define s3WebsiteOrigin before it's used in policies or distribution
    const s3WebsiteOrigin = new origins.HttpOrigin(
      "dnd5eapi.co.s3-website-us-west-1.amazonaws.com",
      {
        protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
      }
    );

    // Cache Policy - to handle QueryString: true and QueryStringCacheKeys: ["nope"]
    const cachePolicy = new cloudfront.CachePolicy(this, "DndCachePolicy", {
      cachePolicyName: "DndAppCachePolicy",
      comment:
        "Cache policy for dnd5eapi.co to forward all query strings but only cache on nope",
      cookieBehavior: cloudfront.CacheCookieBehavior.none(),
      headerBehavior: cloudfront.CacheHeaderBehavior.none(),
      queryStringBehavior:
        cloudfront.CacheQueryStringBehavior.allowList("nope"),
      minTtl: cdk.Duration.seconds(0),
      defaultTtl: cdk.Duration.days(1),
      maxTtl: cdk.Duration.days(365),
      enableAcceptEncodingGzip: false,
      enableAcceptEncodingBrotli: false,
    });

    const distribution = new cloudfront.Distribution(
      this,
      "ImportedCloudFrontDistribution",
      {
        comment: "",
        defaultRootObject: "",
        enabled: true,
        httpVersion: cloudfront.HttpVersion.HTTP2,
        enableIpv6: true,
        priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
        domainNames: ["dnd5eapi.co"],
        certificate: certificate,
        minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_1_2016,
        defaultBehavior: {
          origin: s3WebsiteOrigin,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.ALLOW_ALL,
          compress: false,
          cachePolicy: cachePolicy,
          responseHeadersPolicy: customResponseHeadersPolicy,
        },
      }
    );
  }
}
