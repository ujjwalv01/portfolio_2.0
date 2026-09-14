function BackgroundCanvas() {
  return (
    <>
      <div className="bg-canvas">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
        {/* Cursor-following Bat-Signal spotlight (desktop only, driven by --mx/--my from App) */}
        <div className="bg-spotlight"></div>
        <div className="bg-grain"></div>
      </div>
    </>
  )
}

export default BackgroundCanvas
