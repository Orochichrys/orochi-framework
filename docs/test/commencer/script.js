 document.addEventListener("DOMContentLoaded", () => {
        const toggler = document.querySelector(".sidebar-toggler");
        const sidebar = document.getElementById("sidebar");
        toggler.addEventListener("click", () => {
          sidebar.classList.toggle("active");
        });
      });

// Code copy functionality
document.querySelectorAll('.orochi-code-block').forEach(block => {
  const copyBtn = document.createElement('button');
  copyBtn.className = 'orochi-code-copy';
  copyBtn.innerHTML = '<i class="oi oi-copy"></i>';
  
  copyBtn.addEventListener('click', () => {
    const code = block.querySelector('code').innerText;
    navigator.clipboard.writeText(code);
    copyBtn.innerHTML = '<i class="oi oi-check"></i>';
    setTimeout(() => copyBtn.innerHTML = '<i class="oi oi-copy"></i>', 2000);
  });
  
  block.appendChild(copyBtn);
});

