import { useEffect, useState, useRef, useCallback } from "react";
import '../styles/dropdown.css';


const Dropdown = ({ options = [], onChange, children }) => {
    const [isOpen, setOpen] = useState(false);
    const listRef = useRef(null);

    const handleClickOutside = useCallback((event) => {
        if (listRef.current && !listRef.current.contains(event.target)) {
            setOpen(false);
        }
    }, []);

    const handleOnValueChange = useCallback((value) => {
        if (onChange) {
            setOpen(false);
            onChange(value);
        }
    }, [setOpen, onChange]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);


    return (
        <div className='dropdown-container' ref={listRef}>
            <div onClick={() => setOpen(!isOpen)}>
                {children}
            </div>
            {
                isOpen && options.length > 0 && (
                    <div className='dropdown'>
                        {
                            options.map((option) => {
                                return <div
                                    key={option.value}
                                    onClick={() => handleOnValueChange(option.value)}>
                                    {option.label}
                                </div>;
                            })
                        }
                    </div>
                )
            }
        </div>
    );
};

export default Dropdown