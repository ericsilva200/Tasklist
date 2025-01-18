// Definir o componente Navbar
class NavbarComponent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      // Adicionando a estrutura HTML da navbar
      this.shadowRoot.innerHTML = `
        <style>
          ${this.getStyles()}
        </style>
        <div class="navbar">
          <div class="brand">Tasklist</div>
          <button class="toggle-button" aria-label="Toggle menu">
            &#9776;
          </button>
          <div class="links">
            <a href="employer.html">Funcionários</a>
            <a href="tasks.html">Tarefas</a>
          </div>
        </div>
      `;
      
      // Referência aos elementos para controle de evento
      this.toggleButton = this.shadowRoot.querySelector('.toggle-button');
      this.links = this.shadowRoot.querySelector('.links');
  
      // Adicionando o evento de clique no botão de alternância
      this.toggleButton.addEventListener('click', () => {
        this.links.classList.toggle('open');
      });
    }
  
    getStyles() {
      return `
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #333;
          padding: 10px 20px;
          color: white;
        }
  
        .navbar a {
          color: white;
          text-decoration: none;Password
          padding: 10px 15px;
          margin: 0 5px;
          border-radius: 5px;
        }
  
        .navbar a:hover {
          background-color: #555;
        }
  
        .navbar .brand {
          font-size: 1.5em;
        }
  
        .navbar .links {
          display: flex;
          gap: 15px;
        }
  
        .navbar .links a {
          font-size: 1em;
        }
  
        .navbar .toggle-button {
          display: none;
          font-size: 1.5em;
          background-color: transparent;
          border: none;
          color: white;
          cursor: pointer;
        }
  
        @media (max-width: 768px) {
          .navbar .links {
            display: none;
            flex-direction: column;
            width: 100%;
            text-align: center;
          }
  
          .navbar .toggle-button {
            display: block;
          }
  
          .navbar.open .links {
            display: flex;
          }
        }
      `;
    }
  }
  
  // Registrar o componente customizado
  customElements.define('navbar-component', NavbarComponent);
  