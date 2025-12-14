// src/components/dashboard/Sidebar.tsx (Responsivo)

import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BarChart3,
  FileText,
  Settings,
  PlusCircle,
  User, // Ícone para Perfil/Configurações pode ser melhor
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname;

  // Itens principais da navegação
  const mainItems = [
    {
      to: "/home",
      icon: <Home className="w-5 h-5 md:w-6 md:h-6" />,
      label: "Início",
    },
    {
      to: "/dashboard",
      icon: <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />,
      label: "Dashboard",
    },
    {
      to: "/occurrences/new",
      icon: <PlusCircle className="w-5 h-5 md:w-6 md:h-6" />,
      label: "Registrar Ocorrência",
    },
    {
      to: "/audit",
      icon: <FileText className="w-5 h-5 md:w-6 md:h-6" />,
      label: "Auditoria",
    },
  ];

  // Item de Configurações/Perfil (separado para posicionamento)
  const settingsItem = {
    to: "/profile",
    icon: <User className="w-5 h-5 md:w-6 md:h-6" />,
    label: "Perfil & Configurações",
  }; // Usando ícone User

  // Função auxiliar para renderizar um item (com ou sem tooltip)
  const renderNavItem = (
    item: { to: string; icon: React.ReactNode; label: string },
    isSettings = false
  ) => {
    const active = path === item.to;

    // Link base com estilos comuns e responsivos
    const linkContent = (
      <Link
        to={item.to}
        className={`
          flex items-center justify-center rounded-lg transition-all text-white
          p-3 md:w-[55px] md:h-[55px] md:rounded-[12px] {/* Tamanho e padding */}
          ${
            active
              ? "bg-blue-800 md:bg-[rgba(255,255,255,0.25)]" // Fundo ativo diferente
              : "hover:bg-blue-700 md:hover:bg-[rgba(255,255,255,0.15)]" // Hover
          }
          ${
            isSettings ? "md:mt-auto" : ""
          } {/* Empurra config para baixo no desktop */}
        `}
        aria-label={item.label}
      >
        {item.icon}
      </Link>
    );

    // No desktop (md+), envolve com Tooltip
    // No mobile, renderiza apenas o link
    return (
      <React.Fragment key={item.to}>
        {/* Tooltip Wrapper - Só visível em MD+ */}
        <div className="hidden md:block">
          <Tooltip>
            <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-black text-white text-xs rounded-md py-1 px-2"
            >
              {item.label}
            </TooltipContent>
          </Tooltip>
        </div>
        {/* Link direto - Só visível abaixo de MD */}
        <div className="block md:hidden">{linkContent}</div>
      </React.Fragment>
    );
  };

  return (
    // Aplica estilos base (mobile first) e depois overrides para desktop (md:)
    <TooltipProvider>
      <nav
        className={`
        fixed bottom-0 left-0 right-0 h-16 z-50 {/* Mobile: Fixo embaixo, altura definida */}
        bg-[#1650A7] shadow-lg {/* Cor e Sombra */}
        flex flex-row items-center justify-around px-2 {/* Mobile: Layout horizontal */}

        md:relative md:w-[115px] md:h-screen md:max-h-[calc(100vh-60px)] {/* Desktop: Volta a ser relativo/vertical */}
        md:shrink-0 md:my-[30px] md:ml-[33px] md:rounded-[31px] {/* Desktop: Margens e bordas */}
        md:flex-col md:justify-start md:items-center md:py-8 md:px-0 {/* Desktop: Layout vertical */}
        md:shadow-none md:bottom-auto md:left-auto md:right-auto md:h-auto {/* Desktop: Reseta posições mobile */}
      `}
      >
        {/* Logo e Divisor - Ocultos em mobile (default), visíveis em desktop (md:) */}
        <div className="hidden md:block md:mb-8">
          <img
            src="public/LogoBranca.svg"
            alt="Alerta Conecta Logo"
            className="w-[65px] h-auto mx-auto"
          />
        </div>
        <div className="hidden md:block md:w-[70%] md:h-px md:bg-[#D9D9D9] md:mb-10" />

        {/* Container Principal dos Ícones */}
        <div
          className={`
          flex flex-row items-center justify-around w-full {/* Mobile: Ocupa largura, distribui itens */}
          md:flex-col md:gap-8 md:flex-1 md:w-auto {/* Desktop: Vertical, com gap */}
        `}
        >
          {mainItems.map((item) => renderNavItem(item))}
        </div>

        {/* Ícone de Configurações/Perfil (renderizado separadamente) */}
        {renderNavItem(settingsItem, true)}
      </nav>
    </TooltipProvider>
  );
};

export default Sidebar;
