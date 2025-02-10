import { Button, DatePicker, DatePickerElement, Icon, Select, TextField } from "@vaadin/react-components";
import { formatDateForDatePicker, parseDateForDatePicker } from "Frontend/util/transactionUtils";
import { useEffect, useRef, useState } from "react";
import { amountFilterOptions, incomeCategoryFilteringOptions, currencyFilteringOptions, currencySignsToCodes, usualityFilteringOptions, expenseCategoryFilteringOptions } from "Frontend/constants/constants";
import { Signal } from "@vaadin/hilla-react-signals";

interface Proprs {
    transactionType: "income" | "expense",
    areFiltersDefault: () => boolean;
    clearFilters: () => void;
    amountFilterType: string,
    setAmountFilterType: (type: string) => void;
    amountFilterValue: number;
    setAmountFilterValue: (value: number) => void;
    selectedCurrency: string;
    setSelectedCurrency: (currency: string) => void;
    selectedCategory: string;
    setSelectedCategory: (currency: string) => void;
    startDate: Signal<string>;
    setIsStartDateSelected: (selected: boolean) => void;
    endDate: Signal<string>;
    setIsEndDateSelected: (selected: boolean) => void;
    selectedByUsuality: string;
    setSelectedByUsuality: (currency: string) => void;
}

export default function TransactionFilters({
    transactionType,
    areFiltersDefault, 
    clearFilters,
    amountFilterType,
    setAmountFilterType,
    amountFilterValue,
    setAmountFilterValue,
    selectedCurrency,
    setSelectedCurrency,
    selectedCategory,
    setSelectedCategory,
    startDate,
    setIsStartDateSelected,
    endDate,
    setIsEndDateSelected,
    selectedByUsuality,
    setSelectedByUsuality
} : Proprs) {

    let buttonTheme;
    let categoryFilteringOptions;

    if(transactionType === 'income') {
        buttonTheme = 'success';
        categoryFilteringOptions = incomeCategoryFilteringOptions;
    } else {
        buttonTheme = 'error';
        categoryFilteringOptions = expenseCategoryFilteringOptions;
    }

    const [filtersVisible, setFiltersVisible] = useState(false);
    
    const startDatePickerRef = useRef<DatePickerElement>(null);

    useEffect(() => {
        const datePicker = startDatePickerRef.current;

        if(datePicker) {
            datePicker.i18n = {
                ...datePicker.i18n,
                formatDate: formatDateForDatePicker,
                parseDate: parseDateForDatePicker
            }
        }
    }, [startDatePickerRef.current])

    const endDatePickerRef = useRef<DatePickerElement>(null);
    
    useEffect(() => {
        const datePicker = endDatePickerRef.current;

        if(datePicker) {
            datePicker.i18n = {
                ...datePicker.i18n,
                formatDate: formatDateForDatePicker,
                parseDate: parseDateForDatePicker
            }
        }
    }, [endDatePickerRef.current])

    return (
        <>
        <Button 
                theme={buttonTheme}
                onClick={() => setFiltersVisible(!filtersVisible)} 
                style={{marginLeft: '1rem', marginTop: '1rem', marginBottom: '1rem'}}
            >
                {filtersVisible ? 'Hide Filters' : 'Show Filters'}
                <Icon icon={`vaadin:${filtersVisible ? 'angle-down' : 'angle-right'}`}/>
            </Button>

            <Button 
                theme={buttonTheme}
                disabled={areFiltersDefault()} 
                onClick={() => clearFilters()} 
                style={{marginLeft: '1rem', marginTop: '1rem', marginBottom: '1rem'}}
            >
                Clear Filters
                <i className="fa-solid fa-broom" style={{ marginLeft: '0.5rem' }}></i>
            </Button>

            {filtersVisible && (

                <div style={{display: 'flex', alignItems: 'start', marginBottom: '1rem'}}>
                    <div style={{display: 'flex', flexDirection: 'column', marginLeft: '1rem'}}>
                        <label style={{marginRight: '0.5rem'}}>Filter by amount:</label>
                        <Select
                            items={amountFilterOptions}
                            value={amountFilterType}
                            onValueChanged={(e => setAmountFilterType(e.detail.value))}
                            style={{maxWidth: '200px'}}
                        />

                        <TextField
                            value={amountFilterValue !== null ? amountFilterValue.toString() : ''}
                            onChange={(e) => setAmountFilterValue(e.target.value ? Number(e.target.value) : 0)}
                            style={{maxWidth: '200px'}}
                        />
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column', marginLeft: '1rem'}}>

                        <label style={{marginRight: '0.5rem'}}>Filter by currency:</label>

                        <Select
                            items={currencyFilteringOptions}
                            value={selectedCurrency}
                            onValueChanged={e => setSelectedCurrency(e.detail.value)}
                            style={{maxWidth: '200px'}}

                        />
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column', marginLeft: '1rem'}}>
                        <label style={{marginRight: '0.5rem'}}>Filter by catergory:</label>
                        <Select
                            items={categoryFilteringOptions}
                            value={selectedCategory}
                            onValueChanged={e => setSelectedCategory(e.detail.value)}
                            style={{maxWidth: '200px'}}
                        />
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', marginLeft: '1rem'}}>
                        <label style={{marginRight: '0.5rem'}}>Filter by date:</label>
                        <DatePicker
                            ref={startDatePickerRef}
                            placeholder="From"
                            value={startDate.value}
                            onValueChanged={(e) => {
                                startDate.value = e.detail.value;
                                setIsStartDateSelected(!!e.detail.value);
                            }}
                            style={{maxWidth: '200px'}}
                        />
                        <DatePicker
                            ref={endDatePickerRef}
                            placeholder="To"
                            value={endDate.value}
                            onValueChanged={(e) => {
                                endDate.value = e.detail.value;
                                setIsEndDateSelected(!!e.detail.value);
                            }}
                            style={{maxWidth: '200px'}}
                        />
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', marginLeft: '1rem'}}>
                        <label style={{marginRight: '0.5rem'}}>Filter by usuality:</label>
                        <Select
                            items={usualityFilteringOptions}
                            value={selectedByUsuality}
                            onValueChanged={e => setSelectedByUsuality(e.detail.value)}
                            style={{maxWidth: '200px'}}
                        />
                    </div>
                </div>
            )}
        </>
    )
}