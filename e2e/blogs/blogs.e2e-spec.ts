var blogsList = require('./shared/blogs-list.ts'),
    addBlog = require('./admin/add-blog.ts'),
    editBlog = require('./admin/edit-blog.ts'),
    deleteBlog = require('./admin/delete-blog.ts'),
    manageBlogGallery = require('./admin/manage-blog-gallery.ts'),
    returnToBlogList = require('./admin/return-to-blog-list.ts');

blogsList.test('user', 'user', 'user');
blogsList.test('superadmin', 'superadmin', 'admin');
returnToBlogList.test();
manageBlogGallery.test();
addBlog.test();
editBlog.test();
deleteBlog.test();