import React from 'react';
import '../index.css'

function Header() {
  return (
    <header className="main-header">
      <div className="header-logo">
        <a href="/">Hastane Ekran Yönetimi</a>
      </div>

      <nav className="header-nav">
        <ul>
          <li><a href="/media">Medya Yönetimi</a></li>
          <li><a href="/playlists">Döngü Oluşturma</a></li>
          <li><a href="/screens">Ekranlar</a></li>
          <li><a href="/assign">Atama</a></li>
        </ul>
      </nav>

      <div className="header-user">
        <a href="/" className="login-btn">Giriş Yap</a>
        {/* Eğer kullanıcı login olmuşsa, Giriş Yap yerine profil/log-out gösterirsiniz */}
      </div>
    </header>
  );
}

export default Header;
