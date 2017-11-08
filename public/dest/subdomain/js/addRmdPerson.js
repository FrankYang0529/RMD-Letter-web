function submitAddPerson() {
  const name = document.getElementById('name').value;
  const jobTitle = document.getElementById('jobTitle').value;
  const serviceUnit = document.getElementById('serviceUnit').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;

  if (name.length === 0 || jobTitle.length === 0 || serviceUnit.length === 0 || email.length === 0) {
    swal({
      type: 'warning',
      html: '請確認資料填寫完整',
      showCloseButton: true,
      showCancelButton: false,
      focusConfirm: false,
      confirmButtonText: '關閉',
      confirmButtonAriaLabel: '關閉',
    });
  } else {
    swal({
        type: 'success',
        html: '<h3>新增成功!尚需交由管理者審核通過!</h3><p>跳轉中請稍後...</p',
        timer: 3000,
        onOpen: () => {
          swal.showLoading();
        },
      })
      .then(
        () => {},
        // handling the promise rejection
        (dismiss) => {
          if (dismiss === 'timer') {
            document.getElementById('rmdPerson').submit();
          }
        },
      );
  }
}

function submitStudentForm() {
  $.get('/projects/student-form-answer', function (data) {
    if (data !== null) { //  student-form had been done
      swal({
        type: 'warning',
        html: '已填寫過學生資料，欲修改資料請至「修改資料」',
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText: '我知道了',
        confirmButtonAriaLabel: '我知道了',
      });
    } else {
     $("body").css("cursor", "progress");
      $.getJSON('/projects/student-form', (data) => {
        let answer = [];
        let postData = new FormData();
        const BreakException = {};
        const SizeException = {};

        try {
          data.questions.forEach((question) => {
            if (question.questionType === 'text' || question.questionType === 'textArea') {
              if (question.require && !$(`.${question._id}`).val()) {
                throw BreakException;
              }

              answer.push({
                question_id: question._id,
                choices: [],
                file_url: '',
                text: $(`.${question._id}`).val(),
                textSet: [],
              });
            } else if (question.questionType === 'single' || question.questionType === 'multiple') {
              let optionAnswers = [];
              if (question.require && !$(`.${question._id}`).is(':checked')) {
                throw BreakException;
              }

              question.options.forEach((option) => {
                if ($(`#${option._id}`).is(':checked')) {
                  optionAnswers.push({
                    option_id: option._id, // 所選選項的ID
                    option: option.option,
                  });
                }
              });
              answer.push({
                question_id: question._id,
                choices: optionAnswers,
                file_url: '',
                text: '',
                textSet: [],
              });
            } else {
              if (question.require && !$(`.${question._id}`)[0].files[0]) {
                throw BreakException;
              }
              if ($(`.${question._id}`)[0].files[0] && $(`.${question._id}`)[0].files[0].size > 1024 * 1024 * 30) {
                throw SizeException;
              }
              postData.append(question._id, $(`.${question._id}`)[0].files[0]);

              answer.push({
                question_id: question._id,
                choices: [],
                file_url: 'file',
                text: '',
                textSet: [],
              });
            }
          });

          postData.append('answers', JSON.stringify(answer));

          $.ajax({
            url: '/projects/student-form',
            type: 'POST',
            data: postData,
            processData: false,
            contentType: false,
            success: () => {
            $("body").css("cursor", "default");
              swal({
                type: 'success',
                html: '<h3>成功填寫完畢!</h3><p>檔案上傳較慢，如資料尚未更新請稍後再重新整理</p>',
                showCloseButton: true,
                showCancelButton: false,
                focusConfirm: false,
                confirmButtonText: '我知道了',
                confirmButtonAriaLabel: '我知道了',
              }).then(() => {
                document.location.href = '/recommendData';
              });
            },
          });
        } catch (e) {  //  required missing
          $("body").css("cursor", "default");
          if (e == BreakException) {
            swal({
              type: 'error',
              html: '<p>請確認所有必填選項都已經填寫</p>',
              showCloseButton: true,
              showCancelButton: false,
              focusConfirm: false,
              confirmButtonText: '我知道了',
              confirmButtonAriaLabel: '我知道了',
            });
          } else {
            swal({
              type: 'error',
              html: '<p>上傳檔案大於限制大小30MB</p>',
              showCloseButton: true,
              showCancelButton: false,
              focusConfirm: false,
              confirmButtonText: '我知道了',
              confirmButtonAriaLabel: '我知道了',
            });
          }
          
        }
      });
    }
  });
}

function updateStudentForm() {
  $.get('/projects/student-form-answer', function (data) {
    if (data == null) { //  student-form had been done
      swal({
        type: 'warning',
        html: '尚未填寫資料，請先至「填寫資料」填寫完畢',
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText: '我知道了',
        confirmButtonAriaLabel: '我知道了',
      });
    } else {
      $("body").css("cursor", "progress");
      $.getJSON('/projects/student-form', (data) => {
        let answer = [];
        let postData = new FormData();
        const BreakException = {};
        const SizeException = {};

        try {
          data.questions.forEach((question) => {
            if (question.questionType === 'text' || question.questionType === 'textArea') {
              if (question.require && !$(`.${question._id}`).val()) {
                throw BreakException;
              }
              answer.push({
                question_id: question._id,
                choices: [],
                file_url: '',
                text: $(`.${question._id}`).val(),
                textSet: [],
              });
            } else if (question.questionType === 'single' || question.questionType === 'multiple') {
              let optionAnswers = [];
              if (question.require && !$(`.${question._id}`).is(':checked')) {
                throw BreakException;
              }
              question.options.forEach((option) => {
                if ($(`#${option._id}`).is(':checked')) {
                  optionAnswers.push({
                    option_id: option._id, // 所選選項的ID
                    option: option.option,
                  });
                }
              });
              answer.push({
                question_id: question._id,
                choices: optionAnswers,
                file_url: '',
                text: '',
                textSet: [],
              });
            } else {  // file type
              if (question.require && !$(`.${question._id}`)[0].files[0]) {
                throw BreakException;
              }
              if ($(`.${question._id}`)[0].files[0] && $(`.${question._id}`)[0].files[0].size > 1024 * 1024 * 30) {
                throw SizeException;
              }
              postData.append(question._id, $(`.${question._id}`)[0].files[0]);

              answer.push({
                question_id: question._id,
                choices: [],
                file_url: 'file',
                text: '',
                textSet: [],
              });
            }
          });

          postData.append('answers', JSON.stringify(answer));

          $.ajax({
            url: '/projects/student-form',
            type: 'PUT',
            data: postData,
            processData: false,
            contentType: false,
            success: () => {
              console.log('success');
                $("body").css("cursor", "default");
              swal({
                type: 'success',
                html: '<h3>成功修改完畢!</h3><p>檔案上傳較慢，如資料尚未更新請稍後再重新整理</p>',
                showCloseButton: true,
                showCancelButton: false,
                focusConfirm: false,
                confirmButtonText: '關閉',
                confirmButtonAriaLabel: '關閉',
              }).then(() => {
                document.location.href = '/recommendData';
              });
            },
          });
        } catch (e) {  //  required missing
             $("body").css("cursor", "default");
          if (e == BreakException) {
            swal({
              type: 'error',
              html: '<p>請確認所有必填選項都已經填寫</p>',
              showCloseButton: true,
              showCancelButton: false,
              focusConfirm: false,
              confirmButtonText: '我知道了',
              confirmButtonAriaLabel: '我知道了',
            });
          } else {
            swal({
              type: 'error',
              html: '<p>上傳檔案大於限制大小30MB</p>',
              showCloseButton: true,
              showCancelButton: false,
              focusConfirm: false,
              confirmButtonText: '我知道了',
              confirmButtonAriaLabel: '我知道了',
            });
          }
        }
      });
    }
  });
}

function sendLetter(rmdPersonID) {
  console.log('send: '+ rmdPersonID);

  $.get('/projects/student-form-answer', (data) => {
    if (data === null) {
      swal({
        type: 'error',
        html: '請先完成學生資料填寫',
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText: '我知道了',
        confirmButtonAriaLabel: '我知道了',
      });
    } else {
    swal({
                        title: '確定送出推薦信邀請?',
                        type: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: '是, 送出!'
                    }).then(function () {
      $.get('/projects/letter-number', (student) => {
        if (student.number >= 3) {
          swal({
            type: 'error',
            html: '<p>已經送出超過三封推薦信請求</p><p>如有任何需求，歡迎來信。</p>',
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: '關閉',
            confirmButtonAriaLabel: '關閉',
          });
        } else {
          swal({
            type: 'success',
            html: '<h3>成功送出</h3><p>如進度尚未更新請稍後，請勿重複寄信</p>',
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: '關閉',
            confirmButtonAriaLabel: '關閉',
          });

          $.get(`/projects/${rmdPersonID}/send-letter`);
        }
      });
      });
    }
  });
}

function intro(type, content) {
  $('.swal2-modal').css('width', '620px !important');

  swal.setDefaults({
    confirmButtonText: '下一步 &rarr;',
    cancelButtonText: '我已經清楚了',
    showCancelButton: true,
    animation: false,
    progressSteps: ['1', '2', '3', '4']
  });

  const steps = [{
      title: 'Step 1',
      text: '看清楚公告事項，不錯過任何訊息',
      imageUrl: 'https://s3.us-east-2.amazonaws.com/rmd-letter/step-img/step1.png',
      customClass: 'swal-wide',
      imageWidth: 750,
      imageHeight: 426,
    },
    {
      title: 'Step 2',
      text: '填寫個人推薦資料',
      imageUrl: 'https://s3.us-east-2.amazonaws.com/rmd-letter/step-img/step2.png',
      customClass: 'swal-wide',
      imageWidth: 744,
      imageHeight: 426,
    },
    {
      title: 'Step 3',
      text: '寄信給推薦人!',
      imageUrl: 'https://s3.us-east-2.amazonaws.com/rmd-letter/step-img/step3.png',
      customClass: 'swal-wide',
      imageWidth: 494,
      imageHeight: 410,
    },
    {
      title: 'Step 4',
      text: '時刻確認你的推薦信進度',
      imageUrl: 'https://s3.us-east-2.amazonaws.com/rmd-letter/step-img/step4.png',
      customClass: 'swal-wide',
      imageWidth: 494,
      imageHeight: 410,
    },
  ];

  swal.queue(steps).then(() => {
    swal.resetDefaults();
    if (type === 1) { //  if is the first intro after register
      swal({
          title: '馬上開始使用吧!',
          html: '',
          confirmButtonText: 'OK!',
        })
        .then(function () {
          swal(
            '截止日期',
            content,
            'warning',
          );
        });
    } else {
      swal({
        title: '馬上開始使用吧!',
        html: '',
        confirmButtonText: 'OK!',
      });
    }
  }, () => {
    swal.resetDefaults();
  });
}
