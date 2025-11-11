import React from 'react';
import PropTypes from 'prop-types';

export default function MessageComp({ message }) {
    if (!message) return null;

    const isSuccess = message.startsWith("✅");
    const baseClasses = "p-3 mb-4 rounded-lg font-medium border";
    const statusClasses = isSuccess
        ? "bg-green-100 text-green-700 border-green-300"
        : "bg-red-100 text-red-700 border-red-300";

    return (
        <p className={`${baseClasses} ${statusClasses}`}>
            {message}
        </p>
    );
}

MessageComp.propTypes = {
    message: PropTypes.string,
};
