document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.contact-form');
  const successMsg = document.createElement('div');
  successMsg.textContent = '¡Mensaje enviado exitosamente!';
  successMsg.style.color = '#00e676';
  successMsg.style.marginTop = '1rem';
  successMsg.style.fontWeight = 'bold';
  successMsg.style.display = 'none';
  form.parentNode.insertBefore(successMsg, form.nextSibling);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: data,
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(response => {
        if (response.ok) {
          form.reset();
          successMsg.style.display = 'block';
        } else {
          response.json().then(data => {
            alert(data.error || 'Hubo un error al enviar el mensaje.');
          });
        }
      })
      .catch(() => {
        alert('Hubo un error de conexión.');
      });
  });
});