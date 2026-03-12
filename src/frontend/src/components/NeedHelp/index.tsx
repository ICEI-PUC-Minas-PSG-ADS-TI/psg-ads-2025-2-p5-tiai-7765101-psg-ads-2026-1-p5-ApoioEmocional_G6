import "./NeedHelp.css";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";

const NeedHelp = () => {
    return (<motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="support-card support-card-stack"
    >
        <h3 className="support-heading">Precisa de ajuda?</h3>
        <p className="support-text">
            Se você está passando por um momento difícil, você pode buscar ajuda.
        </p>
        <div className="support-info">
            <p className="support-name">
                CVV – Centro de Valorização da Vida
            </p>
            <p className="support-phone">
                <Phone size={14} /> 188
            </p>
            <span className="support-text-small">Disponível 24/7 no Brasil</span>
        </div>
    </motion.div>);
}

export default NeedHelp;