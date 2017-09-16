function submitAddPerson() {
  const name = document.getElementById('name').value;
  const jobTitle = document.getElementById('jobTitle').value;
  const serviceUnit = document.getElementById('serviceUnit').value;
  const email = document.getElementById('email').value;

  if (name.length === 0 || jobTitle.length === 0 || serviceUnit.length === 0 || email.length === 0) {
    $('#alertContent').html('請確認資料填寫完整');
    $('#alertFooter').html('關閉');
    $('#alertMessage').modal('show');
  } else {
    $('#alertContent').html('新增成功!在系辦認證成功後會加入推薦人名單中!');
    $('#alertFooter').html('跳轉中請稍等');
    $('#alertMessage').modal('show');
    setTimeout(() => {
      document.getElementById('rmdPerson').submit();
    }, 2000);
  }
}

function submitStudentForm() {
  $.get('/projects/student-form-answer', function (data) {
    if (data !== null) { //  student-form had been done
      $('#alertContent').html('已填寫過學生資料，欲修改資料請至「修改資料」');
      $('#alertFooter').html('關閉');
      $('#alertMessage').modal('show');
    } else {
      $.getJSON('/projects/student-form', (data) => {
        console.log(data);
        let answer = [];

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
          }/* else { //  textSet
            let textSet = [];
            question.subQuestions.forEach((sub) => {
              textSet.push({
                subQuestion_id: sub._id,
                text: $(`#${sub._id}`).val(),
              });
            });
            answer.push({
              question_id: question._id,
              choices: [],
              file_url: '',
              text: $(`.${question._id}`).val(),
              textSet,
            });
          }*/
        });

        $.ajax({
          url: '/projects/student-form',
          type: 'POST',
          data: {
            answers: JSON.stringify(answer),
          },
        });
        $('#alertContent').html('成功填寫完畢!');
        $('#alertFooter').html('關閉');
        $('#alertMessage').modal('show');
        $('#alertFooter').attr('onclick', "document.location.href = '/recommendData'");
      });
    }
  });
}

function updateStudentForm() {
  $.getJSON('/projects/student-form', (data) => {
    console.log(data);
    let answer = [];

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
      }/* else { //  textSet
        let textSet = [];
        question.subQuestions.forEach((sub) => {
          textSet.push({
            subQuestion_id: sub._id,
            text: $(`#${sub._id}`).val(),
          });
        });
        answer.push({
          question_id: question._id,
          choices: [],
          file_url: '',
          text: $(`.${question._id}`).val(),
          textSet,
        });
      }*/
    });

    $.ajax({
      url: '/projects/student-form',
      type: 'PUT',
      data: {
        answers: JSON.stringify(answer),
      },
    });
    $('#alertContent').html('成功修改完畢!');
    $('#alertFooter').html('關閉');
    $('#alertMessage').modal('show');
    $('#alertFooter').attr('onclick', "document.location.href = '/recommendData'");
  });
}


function sendLetter(rmdPersonID) {
  console.log(rmdPersonID);

  $.get('/projects/student-form-answer', function (data) {
    console.log(data);
    if (data === null) {
      $('#alertContent').html('請先完成學生資料填寫');
      $('#alertFooter').html('關閉');
      $('#alertMessage').modal('show');
    } else {
      $('#alertContent').html('成功送出!');
      $('#alertFooter').html('關閉');
      $('#alertMessage').modal('show');

      $.get(`/projects/${rmdPersonID}/send-letter`);
    }
  });
}