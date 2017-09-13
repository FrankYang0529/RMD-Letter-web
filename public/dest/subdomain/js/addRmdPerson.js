function submitAddPerson () {
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
