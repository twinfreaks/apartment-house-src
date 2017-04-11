let requestsList = require('./admin/requests-list.ts'),
    addRequestType = require('./admin/add-request-type.ts'),
    editRequestType = require('./admin/edit-request-type.ts'),
    deleteRequestType = require('./admin/delete-request-type.ts'),
    returnToRequestTypesList = require('./admin/return-to-request-types-list.ts'),
    requestTypesList = require('./admin/request-types-list.ts');

requestsList.test();
requestTypesList.test();
returnToRequestTypesList.test();
addRequestType.test();
editRequestType.test();
deleteRequestType.test();
