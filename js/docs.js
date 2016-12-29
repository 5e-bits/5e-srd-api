// var sticky = $('.nav-group');
// var docSelect = $('.doc-select');
// var offset = sticky.offset();
// var sideNav = $('.side-nav');
// var navParents = $('.doc-select').children('ul').children('li');
// var doc = $(document);
// var win = $(window);

// function navOps () {

//     //check sticky
//     if (doc.scrollTop() >= (offset.top - 65)) {

//         console.log(window.innerHeight - offset.top);

//         sticky.addClass('stick');
//         sticky.css({
//             width: sideNav.width() + 'px',
//         });

//     } else {

//         sticky.removeClass('stick');
//         sticky.css({ width: '' });
//     }

//     navParents.removeClass('active');
//     var parent;
//     var target;
//     var activeParent = $(navParents[0]);
//     var scrollTop = win.scrollTop();

//     for (var i = 0; i < navParents.length; i++) {

//         parent = $(navParents[i]);

//         target = $(parent.find('a').attr('href'));

//         if (scrollTop >= target.offset().top) {
//             activeParent = parent;
//         } else {
//             break;
//         }
//     }

//     activeParent.addClass('active');

//     var children = activeParent.find('li');
//     var child;
//     var activeChild;

//     children.removeClass('active');

//     for (i = 0; i < children.length; i++) {

//         child = $(children[i]);
//         target = $(child.find('a').attr('href'));

//         if (scrollTop >= target.offset().top) {
//             activeChild = child;
//         } else {
//             break;
//         }
//     }

//     if (activeChild) {

//         activeChild.addClass('active');
//     }
// }

// doc.scroll(function () {

//     navOps();
// });

// win.resize(function () {

//     navOps();
// });

// navOps();


