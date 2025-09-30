import '../styles/comidas.css';

function ContenedorComida({ item, onClick }) {
    if (!item) return null;

    return (
        <div
            className="item-comida-grid"
            onClick={() => onClick(item)}
            style={{
                cursor: 'pointer',
                position: 'relative',
                minHeight: '180px', // asegura espacio para el precio fijo abajo
                paddingBottom: '28px' // espacio para el precio
            }}
        >
            <div>
                <img
                    src={item.image || "./logo.png"}
                    alt={item.name}
                    style={{
                        width: '100%',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                    }}
                />
            </div>
            <h4
                style={{
                    textAlign: 'center',
                    marginTop: '8px',
                    marginBottom: '0',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minHeight: '2.6em', // asegura espacio para 2 líneas
                    lineHeight: '1.3em'
                }}>{item.name}</h4>
            {item.price !== undefined && (
                <div style={{
                        color: "#605F66",
                        fontWeight: "bold",
                        textAlign: "center",
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 20,
                        fontSize: "1.1em"
                    }}>
                    ${item.price}
                </div>
            )}
        </div>
    );
}

export default ContenedorComida;
