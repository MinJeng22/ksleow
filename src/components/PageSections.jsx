import SectionDivider from "./SectionDivider.jsx";

export function getSection(sections, id) {
  return sections.find((section) => section.id === id);
}

export function getSectionNavItems(sections) {
  return sections
    .filter((section) => !section.hideInNav)
    .map(({ id, label, icon }) => ({ id, label, icon }));
}

export function PageSectionDivider({ sections, id, section, ...props }) {
  const resolvedSection = section || getSection(sections || [], id);
  if (!resolvedSection) return null;
  return <SectionDivider section={resolvedSection} {...props} />;
}

