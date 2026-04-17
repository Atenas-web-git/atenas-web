"use client";

import { useState } from "react";
import { Navbar } from "@/components/home/Navbar";
import { HeroRevista } from "@/components/revista/HeroRevista";
import { FiltrosCategorias, type Categoria } from "@/components/revista/FiltrosCategorias";
import { ArticuloDestacado } from "@/components/revista/ArticuloDestacado";
import { GridNoticias } from "@/components/revista/GridNoticias";
import { PorCategoria } from "@/components/revista/PorCategoria";
import { CollageMomentos } from "@/components/revista/CollageMomentos";
import { FooterCTA } from "@/components/home/FooterCTA";
import { ARTICULO_DESTACADO, ARTICULOS_RECIENTES, ARTICULOS } from "@/components/revista/data";

export default function RevistaPage() {
  const [categoriaActiva, setCategoriaActiva] = useState<Categoria>("Todos");
  const [search, setSearch] = useState("");

  const articulosFiltrados = ARTICULOS.filter(a => {
    const matchCat = categoriaActiva === "Todos" || a.categoria === categoriaActiva;
    const matchSearch = !search || a.titulo.toLowerCase().includes(search.toLowerCase()) || a.extracto.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Navbar />
      <main>
        <HeroRevista searchValue={search} onSearchChange={setSearch} />
        <FiltrosCategorias activa={categoriaActiva} onChange={setCategoriaActiva} />
        {categoriaActiva === "Todos" && !search && (
          <ArticuloDestacado articulo={ARTICULO_DESTACADO} />
        )}
        <GridNoticias
          articulos={categoriaActiva === "Todos" && !search ? ARTICULOS_RECIENTES : articulosFiltrados}
          titulo={categoriaActiva === "Todos" ? "Lo más reciente" : categoriaActiva}
          verTodosHref="/revista"
        />
        {categoriaActiva === "Todos" && !search && (
          <>
            <PorCategoria />
            <CollageMomentos />
          </>
        )}
        <FooterCTA />
      </main>
    </>
  );
}
