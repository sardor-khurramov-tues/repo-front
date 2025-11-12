import ContributorItem from './ContributorItem';
import PropTypes from 'prop-types';

export default function ContributorList({
    contributors,
    onRemove,
    isRemoving,
    documentSubmitterId,
}) {
    if (!contributors || contributors.length === 0) {
        return <p className="text-gray-500 italic">No additional contributors listed.</p>;
    }

    return (
        <div className="space-y-2 mb-6">
            {contributors.map((contributor) => (
                <ContributorItem
                    key={contributor.id}
                    contributor={contributor}
                    onRemove={onRemove}
                    isRemoving={isRemoving}
                    isSelf={contributor.appUser.id === documentSubmitterId}
                />
            ))}
        </div>
    );
}

ContributorList.propTypes = {
    contributors: PropTypes.array.isRequired,
    onRemove: PropTypes.func.isRequired,
    isRemoving: PropTypes.bool,
    documentSubmitterId: PropTypes.number.isRequired,
};
