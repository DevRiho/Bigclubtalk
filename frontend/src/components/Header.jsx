import React from "react";
import logo from "../assets/WhatsApp Image 2026-06-20 at 9.53.17 PM.jpeg";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <img src={logo} alt="Big Club Talk Logo" className="logo" />
      <h1 className="title">Big Club Talk</h1>
    </header>
  );
}
