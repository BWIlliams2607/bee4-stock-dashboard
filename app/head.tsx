// app/head.tsx
export default function Head() {
  return (
    <>
      {/* Force browser UI (form controls, scrollbars, etc.) into dark mode */}
      <meta name="supported-color-schemes" content="dark" />
      <meta name="color-scheme" content="dark" />
    </>
  );
}
