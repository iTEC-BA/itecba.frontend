import React, { useState } from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { PageHeader } from "@components/ui/PageHeader";
import { usePageTitle } from "@hooks/usePageTitle";
import { SECTIONS } from "@/features/plugins/data/sections";
import { SectionBlock } from "@/features/plugins/components/SectionBlock";
import { PluginsSearchBar } from "@/features/plugins/components/PluginsSearchBar";
import { SearchResults } from "@/features/plugins/components/SearchResults";

export const PluginsPage: React.FC = () => {
  usePageTitle("Herramientas y Recursos");
  const [query, setQuery] = useState("");
  const isSearching = query.trim().length > 0;

  return (
    <MainLayout>
      <PageHeader
        title="Herramientas y Recursos"
        description="Accesos directos a todas las herramientas de iTEC, portales oficiales de la UTN FRBA y recursos útiles para cada materia."
        iconType="tool"
        colorTheme="orange"
      />
      <PluginsSearchBar value={query} onChange={setQuery} />
      {isSearching
        ? <SearchResults query={query} sections={SECTIONS} />
        : SECTIONS.map((section) => <SectionBlock key={section.id} section={section} />)
      }
    </MainLayout>
  );
};

export default PluginsPage;
