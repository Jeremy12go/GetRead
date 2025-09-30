function Contenedor({ children }) {
    return (
        <div style={{
            maxWidth: '400px',
            margin: '0 auto',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
        }}>
            {children}
        </div>
    );
}

export default Contenedor;