import React from 'react';
import PropTypes from 'prop-types';
import MessageComp from '@/components/MessageComp';

export default function PasswordResetModal({
    userToReset, newPassword, setNewPassword, closePasswordModal, handlePasswordReset, message
}) {
    if (!userToReset) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h3 className="text-xl font-bold mb-4">
                    Reset Password for {userToReset.username}
                </h3>

                {/* ✅ Replaced inline message block with MessageComp */}
                <MessageComp message={message} />

                <form onSubmit={handlePasswordReset}>
                    <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        New Password (Min 8, No spaces)
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={8}
                        maxLength={64}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                                   focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-4"
                    />
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={closePasswordModal}
                            className="px-4 py-2 bg-gray-300 text-gray-800 font-medium rounded-lg hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
                        >
                            Reset Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

PasswordResetModal.propTypes = {
    userToReset: PropTypes.object,
    newPassword: PropTypes.string.isRequired,
    setNewPassword: PropTypes.func.isRequired,
    closePasswordModal: PropTypes.func.isRequired,
    handlePasswordReset: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
};
