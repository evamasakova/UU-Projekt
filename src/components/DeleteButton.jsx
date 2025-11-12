import React from "react";
import { Trash2 } from "lucide-react";

/**
 * Červené tlačítko s ikonou koše (z lucide-react).
 * - používá Tailwind třídy pro hover efekt (pokud máš Tailwind)
 * - nebo inline styly, pokud ne
 */
export default function DeleteButton({ onClick, disabled = false, size = 20 }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-label="Smazat"
            className="text-red-600 hover:text-red-700 disabled:opacity-50"
            style={{
                background: "transparent",
                border: "none",
                cursor: disabled ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 4,
            }}
        >
            <Trash2 width={size} height={size} strokeWidth={2} />
        </button>
    );
}
