import { motion } from 'framer-motion';
import '../styles/components/TractorList.css';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

return (
    <div className="container">
        <h2 className="text-center mb-2">Available Tractors</h2>
        <motion.div 
            className="tractor-list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {tractors.map(tractor => (
                <motion.div 
                    key={tractor.id} 
                    className="tractor-card"
                    variants={cardVariants}
                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                >
                    <img 
                        src={tractor.image} 
                        alt={tractor.model} 
                        className="tractor-image"
                        loading="lazy"
                    />
                    <div className="tractor-details">
                        <h3>{tractor.model}</h3>
                        <p>{tractor.description}</p>
                        <span 
                            className={`status-badge ${
                                tractor.available ? 'status-available' : 'status-booked'
                            }`}
                            role="status"
                            aria-label={`Status: ${tractor.available ? 'Available' : 'Booked'}`}
                        >
                            {tractor.available ? 'Available' : 'Booked'}
                        </span>
                        <motion.button 
                            className="btn btn-primary mt-1"
                            onClick={() => handleBooking(tractor.id)}
                            whileTap={{ scale: 0.95 }}
                            aria-label={`Book ${tractor.model}`}
                        >
                            Book Now
                        </motion.button>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    </div>
); 