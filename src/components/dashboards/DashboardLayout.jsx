import React from 'react';
import PropTypes from 'prop-types';
import Message from '../commons/MessageComp';

export default function DashboardLayout({ title, icon, message, children }) {
    return (
        <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
                {icon} {title}
            </h1>

            <Message message={message} />

            {children}
        </div>
    );
}

DashboardLayout.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    message: PropTypes.string,
    children: PropTypes.node.isRequired,
};
