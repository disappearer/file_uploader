$('.upload-btn').on('click', function(){
  $('#upload-input').click()
  $('.progress-bar').text('0%')
  $('.progress-bar').width('0%')
})

$('#upload-input').on('change', function(){
  var file = $(this)[0].files[0]
  var formData = new FormData()
  formData.append('upload', file, file.name)
  $.ajax({
    url: '/upload',
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: function(data){
      console.log('Upload successful.\n' + data)
    },
    xhr: function() {
      var xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', function(evt){
        if (evt.lengthComputable){
          var percentComplete = evt.loaded / evt.total;
          percentComplete = parseInt(percentComplete * 100);

          $('.progress-bar').text(percentComplete + '%')
          $('.progress-bar').width(percentComplete + '%')

          if (percentComplete == 100) {
            $('.progress-bar').html('Done')
            if(!$('#panel-footer').length){
              $('.panel-body').append('<div id="panel-footer"></div>')
            }
            $('#panel-footer').append(
              '<div>Uploaded file: ' + file.name + " (size: "
              + file.size + ")</div>"
            )
          }
        }
      }, false)

      return xhr
    }
  })
})
