$('.generic-project-sidebar-list-item-all-items.all-projects').on('click', function (evt) {
    $('.tab-link-all-projects').triggerHandler('click');
    evt.preventDefault();
  });

  $('.generic-project-sidebar-list-item-all-items.devops').on('click', function (evt) {
    $('.tab-link-devops').triggerHandler('click');
    evt.preventDefault();
  });

  $('.generic-project-sidebar-list-item-all-items.security').on('click', function (evt) {
    $('.tab-link-security').triggerHandler('click');
    evt.preventDefault();
  });

  $('.generic-project-sidebar-list-item-all-items.iot').on('click', function (evt) {
    $('.tab-link-iot').triggerHandler('click');
    evt.preventDefault();
  });