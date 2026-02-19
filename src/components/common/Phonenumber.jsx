import React from 'react';
import PhoneInput from 'react-phone-number-input';
import { parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

/**
 * Common phone number input component with country selector
 * @param {string} value - E.164 format (e.g. "+971501234567") or combined mobileCode + mobileNumber
 * @param {Function} onChange - (value, { mobileCode, mobileNumber }) => void
 * @param {string} error - Error message to display
 * @param {string} label - Label text
 * @param {boolean} required - Show required asterisk
 * @param {string} defaultCountry - Default country code (e.g. "AE" for UAE)
 * @param {string} placeholder - Input placeholder
 * @param {string} className - Additional class names
 * @param {boolean} disabled - Disable the input
 */
function Phonenumber({
  value = '',
  onChange,
  error,
  label,
  required = false,
  defaultCountry = 'AE',
  placeholder = 'Enter phone number',
  className = '',
  disabled = false,
  ...rest
}) {
  const handleChange = (newValue) => {
    if (!onChange) return;

    if (!newValue) {
      onChange('', { mobileCode: '', mobileNumber: '' });
      return;
    }

    try {
      const parsed = parsePhoneNumber(newValue);
      if (parsed) {
        const mobileCode = `+${parsed.countryCallingCode}`;
        const mobileNumber = parsed.nationalNumber || '';
        onChange(newValue, { mobileCode, mobileNumber });
      } else {
        // Partial input (e.g. only country selected) - extract code if possible
        const match = newValue.match(/^(\+\d{1,4})(\d*)$/);
        if (match) {
          onChange(newValue, { mobileCode: match[1], mobileNumber: match[2] || '' });
        } else {
          onChange(newValue, { mobileCode: '', mobileNumber: newValue.replace(/\D/g, '') });
        }
      }
    } catch {
      const match = newValue.match(/^(\+\d{1,4})(\d*)$/);
      if (match) {
        onChange(newValue, { mobileCode: match[1], mobileNumber: match[2] || '' });
      } else {
        onChange(newValue, { mobileCode: '', mobileNumber: newValue.replace(/\D/g, '') });
      }
    }
  };

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <PhoneInput
        international
        defaultCountry={defaultCountry}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className="phone-input-wrapper"
        numberInputProps={{
          className: 'form-control',
          autoComplete: 'tel',
        }}
        countrySelectProps={{
          className: 'form-control',
        }}
        {...rest}
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
}

export default Phonenumber;
