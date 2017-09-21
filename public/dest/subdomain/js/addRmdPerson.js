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
        html: '<p>新增成功!尚需交由管理者審核通過!</p><p>跳轉中請稍後...</p',
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
      $.getJSON('/projects/student-form', (data) => {
        let answer = [];
        let postData = new FormData();

        data.questions.forEach((question) => {
          if (question.questionType === 'text' || question.questionType === 'textArea') {
            answer.push({
              question_id: question._id,
              choices: [],
              file_url: '',
              text: $(`.${question._id}`).val(),
              textSet: [],
            });
          } else if (question.questionType === 'single' || question.questionType === 'multiple') {
            let optionAnswers = [];
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
            postData.append(question._id, $(`.${question._id}`)[0].files[0]);
            console.log(postData);

            answer.push({
              question_id: question._id,
              choices: [],
              file_url: 'file',
              text: '',
              textSet: [],
            });
          }
        });

        postData.append("answers", JSON.stringify(answer));

        $.ajax({
          url: '/projects/student-form',
          type: 'POST',
          data: postData,
          processData: false,
          contentType: false,
          success: () => {
            swal({
              type: 'success',
              html: '<p>成功填寫完畢!</p><p>檔案上傳較慢，如資料尚未更新請稍後再重新整理</p>',
              showCloseButton: true,
              showCancelButton: false,
              focusConfirm: false,
              confirmButtonText: '<a href="/recommendData" style="color: white">我知道了</a>',
              confirmButtonAriaLabel: '我知道了',
            });
          },
        });
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

      $.getJSON('/projects/student-form', (data) => {
        console.log(data);

        let answer = [];
        let postData = new FormData();

        data.questions.forEach((question) => {
          if (question.questionType === 'text' || question.questionType === 'textArea') {
            answer.push({
              question_id: question._id,
              choices: [],
              file_url: '',
              text: $(`.${question._id}`).val(),
              textSet: [],
            });
          } else if (question.questionType === 'single' || question.questionType === 'multiple') {
            let optionAnswers = [];
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
            swal({
              type: 'success',
              html: '<p>成功修改完畢!</p><p>檔案上傳較慢，如資料尚未更新請稍後再重新整理</p>',
              showCloseButton: true,
              showCancelButton: false,
              focusConfirm: false,
              confirmButtonText: '關閉',
              confirmButtonAriaLabel: '關閉',
            });
          },
        });
      });
    }
  });
}


function sendLetter(rmdPersonID) {
  console.log(rmdPersonID);

  $.get('/projects/student-form-answer', function (data) {
    console.log(data);
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
        type: 'success',
        html: '成功送出',
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText: '關閉',
        confirmButtonAriaLabel: '關閉',
      });

      $.get(`/projects/${rmdPersonID}/send-letter`);
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
      imageWidth: 620,
      imageHeight: 355,
    },
    {
      title: 'Step 2',
      text: '填寫個人推薦資料',
      imageUrl: 'https://s3.us-east-2.amazonaws.com/rmd-letter/step-img/step2.png',
      customClass: 'swal-wide',
      imageWidth: 620,
      imageHeight: 355,
    },
    {
      title: 'Step 3',
      text: '寄信給推薦人!',
      imageUrl: 'https://s3.us-east-2.amazonaws.com/rmd-letter/step-img/step3.png',
      customClass: 'swal-wide',
      imageWidth: 380,
      imageHeight: 315,
    },
    {
      title: 'Step 4',
      text: '時刻確認你的推薦信進度',
      imageUrl: 'https://s3.us-east-2.amazonaws.com/rmd-letter/step-img/step4.png',
      customClass: 'swal-wide',
      imageWidth: 380,
      imageHeight: 315,
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