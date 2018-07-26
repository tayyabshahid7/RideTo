import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import SchoolSelect from "./index";

Enzyme.configure({ adapter: new Adapter() });

const SCHOOLS = [
  { id: 1, name: "Test School 1" },
  { id: 2, name: "Test School 2" }
];

it("Renders select", () => {
  const wrapper = mount(
    <SchoolSelect schools={SCHOOLS} onChange={jest.fn()} />
  );

  const option = wrapper.find("option").first();
  expect(option.text()).toBe(SCHOOLS[0].name);
});

it("Selects correct option", () => {
  const wrapper = mount(
    <SchoolSelect selected={2} schools={SCHOOLS} onChange={jest.fn()} />
  );

  const select = wrapper.find("select").first();
  expect(select.props().value).toBe(2);
});

it("Fires change event", () => {
  const onChange = jest.fn();
  const wrapper = mount(
    <SchoolSelect selected={2} schools={SCHOOLS} onChange={onChange} />
  );

  const select = wrapper.find("select").first();
  select.props().onChange({
    target: { value: 1, selectedIndex: 0, options: [{}] }
  });

  expect(onChange).toHaveBeenCalled();
});
