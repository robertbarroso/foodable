export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(20, 32, 25, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "48px 20px",
        overflowY: "auto",
        zIndex: 1000,
      }}
    >
      <div
        className="recipe-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#ffffff",
          width: "800px",
          maxWidth: "95%",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "28px",
          border: "1px solid #e2e8e4",
          borderRadius: "18px",
          boxShadow: "0 18px 45px rgba(36, 73, 51, 0.18)",
        }}
      >
        {children}

        <div
          style={{
            marginTop: "24px",
            paddingTop: "16px",
            borderTop: "1px solid #e2e8e4",
            textAlign: "right",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "0.65rem 1rem",
              border: "1px solid #d6ddd8",
              borderRadius: "10px",
              backgroundColor: "#ffffff",
              color: "#59625d",
              fontFamily: "inherit",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}