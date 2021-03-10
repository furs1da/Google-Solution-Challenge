import React, { Component } from "react";
import Select from "react-select";

class SelectField extends Component {
  handleChange = value => {
    const { onChange, name } = this.props;

    onChange(name, value);
  };

  handleBlur = () => {
    const { onBlur, name } = this.props;

    onBlur(name, true);
  };

  render() {
    const {
      id,
      name,
      label,
      placeholder,
      options,
      value,
      isMulti,
      isDisabled,
      touched,
      error,
      isClearable,
      backspaceRemovesValue
    } = this.props;

    return (
      <div className="input-field-wrapper">
        {label && (
          <h3 className="input-label" htmlFor={name} error={error}>
            {label}
          </h3>
        )}

        <Select
          id={id}
          placeholder={placeholder}
          options={options}
          value={value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          touched={touched}
          error={error}
          isMulti={isMulti}
          isDisabled={isDisabled}
          isClearable={isClearable}
          backspaceRemovesValue={backspaceRemovesValue}
          components={{ ClearIndicator: null }}
        />

        {touched && error ? <p className="error-text">{error}</p> : null}
      </div>
    );
  }
}

export { SelectField };
