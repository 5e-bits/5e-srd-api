interface APIReference {
  index: string;
  name: string;
  url: string;
}

const APIReferenceSchema = {
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
};

export { APIReference, APIReferenceSchema };
