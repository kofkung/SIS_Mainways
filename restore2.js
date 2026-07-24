import fs from 'fs';

const APP_JSX = 'c:/Users/SisUser/Desktop/SISMainways/SISMainways/src/App.jsx';
let code = fs.readFileSync(APP_JSX, 'utf-8');

const missingComponents = `
function Footer({ navigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <img src={logoWhite} alt="SIS Siam Infinity Solution logo" />
        <p>MRT fare gates, AFC integration, station devices, and project support.</p>
        <p className="footer-contact">
          Siam Infinity Solution Co., Ltd.<br />
          111/2 Ramkhamhaeng 94 Alley, Saphan Sung, Bangkok 10240<br />
          Tel: +66 089 924 3843, 02-001-0518
        </p>
      </div>
      <nav aria-label="Footer navigation">
        {navItems.map((item) => (
          <button key={item.id} type="button" onClick={() => navigate(item.id)}>
            {item.label}
          </button>
        ))}
      </nav>
      <small>&copy; 2026 SIS Siam Infinity Solution. All rights reserved.</small>
    </footer>
  );
}
`;

code = code.replace('export default App;', missingComponents + '\nexport default App;');

fs.writeFileSync(APP_JSX, code);
console.log("Restored Footer");
