import "./TopBar.css";
import CallTypeDropdown from "../CallTypeDropdown/CallTypeDropdown";
import DateDropdown from "../DateDropdown/DateDropdown";

function TopBar({ sortByType, sortByDate, resetFilters, isFilterApplied, resetFiltersTrigger }) {
  return (
    <div className="topBar">
      <div className="filtersWrapper">
      <CallTypeDropdown sortByType={sortByType}  resetFiltersTrigger={resetFiltersTrigger}/>
      {isFilterApplied && (
          <div className="removeAllFilters" onClick={resetFilters}>
            Сбросить фильтры
            <img src="/assets/cross.svg" alt="close" />
          </div>
        )}
      </div>
      <DateDropdown sortByDate={sortByDate}  resetFiltersTrigger={resetFiltersTrigger} />
    </div>
  );
}

export default TopBar;
