const SpecialtyFilterButton = ({
  specialty,
  isSelected,
  onClick
}) => {
  return (
    <button
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '10px 16px',
        borderRadius: '8px',
        transition: 'all 0.2s',
        fontSize: '14px',
        fontWeight: isSelected ? '600' : '500',
        background: isSelected ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' : 'transparent',
        color: isSelected ? 'white' : '#4B5563',
        border: isSelected ? 'none' : '1px solid #E5E7EB',
        cursor: 'pointer',
        boxShadow: isSelected ? '0 4px 12px rgba(99, 102, 241, 0.2)' : 'none',
        marginBottom: '4px'
      }}
      onClick={onClick}
    >
      {specialty}
    </button>
  );
};

export default SpecialtyFilterButton;
