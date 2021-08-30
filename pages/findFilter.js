import React, { useRef, useEffect , useState} from "react";
import { Form, Checkbox, Divider, Button, Select, Slider ,Input } from "antd";
import { TaskTitle } from "../../CommonStyle";
import { FilterFormWrapper, FilterWrapper } from "../Filter/style";
import { useDispatch, useSelector } from "react-redux";
import task from "@iso/redux/task/actions";
import filterAction from "@iso/redux/userTypeAndFilter/actions";
import {
  AppConstant,
  NameRegex,
  PasswordStrengthRegex,
  PhoneNumberMaskRegex,
  BudgetNumber,
  zipCodeRegex
} from '@iso/config/constant';
const { findTask ,getInvitedTask } = task;

const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const Filter = (props) => {
  const {updatePagination , updateFindTaskCategory} = filterAction
  const [findFilterForm] = Form.useForm();
  let Category = useSelector((state) => state.Categories);
  let parentCategory = Category.allParentCategories;
  let idWiseSubCategories = Category.idWiseSubCategories;
  const [subcatList, setSubcatList] = useState([]);
  const [parentCatValue, setParentCatValue] = useState(null);
  const [subCatValue, setSubCatValue] = useState(null);
  const [budget, setBudget] = useState([]);

  let pagination = useSelector(
    (state) => state.userTypeAndFilter.pagination.findTask
  );

  const dispatch = useDispatch();
  const { updateFindTaskFilter,clearAll } = filterAction;

  
  let AllOptions = useSelector(
    (state) => state.userTypeAndFilter.findTaskFilter
  );

  const plainOptions = Object.keys(AllOptions);
  const defaultCheckedList = plainOptions.filter(
    (ele) => AllOptions[ele] === 1
  );
  const inputField = useRef(null);
  const [checkedList, setCheckedList] = React.useState(defaultCheckedList);
  // const [indeterminate, setIndeterminate] = React.useState(true);
  // const [checkAll, setCheckAll] = React.useState(false);

  const onChange = (list) => {
    setCheckedList(list);
    // setIndeterminate(!!list.length && list.length < plainOptions.length);
    // setCheckAll(list.length === plainOptions.length);
  };

  // const onCheckAllChange = (e) => {
  //   setCheckedList(e.target.checked ? plainOptions : []);
  //   setIndeterminate(false);
  //   setCheckAll(e.target.checked);
  // };

  function onChanged(value) {
   console.log("onChange: ", value, inputField);
  }

  function onAfterChange(value) {
   // console.log("onAfterChange: ", value);
  }
  
  function handleChange(value) {
    console.log("Thsi is value",value)
    let list = []
value.map(function(each){
  if(each.includes("kr")){
  console.log("this is each",each)
    console.log(each.includes(","))
    list.push(each.replace("kr,", "-"))
  }else if(each.includes(",")){
    console.log("this also inclu")
    list.push(each.replace(",", "-"))
  }else{
    console.log("world")
  }

}
)
console.log("this is cool list",list) 
 
    let budget = []
  value.map(eachValue => 
    
budget.push({"start_value":parseInt(eachValue.split(",")[0]),
"end_value": parseInt(eachValue.split(",")[1])})
    )

    setBudget(budget)

  }
  useEffect(() => {
    let payload = {
      task_budget: [0, -1],
      task_with_no_bid: AllOptions["Tasks with no bids"] === 1 ? 1 : 0,
      remote_work: 0,
      nemid_authorization: 0,
      task_urgent: 0,
      task_for_freelance: 0,
      task_for_business: 0,
      placed_bids: 0,
      page: pagination.page,
      limit: pagination.limit,
    };
    dispatch(findTask(payload));
    dispatch(getInvitedTask());
    console.log("this is payload of find task fileter",payload)

  }, []);
  const onChange2 = (e) => {

    let payload = {
      value: e.target.value,
      checked: e.target.checked ? 1 : 0,
    };
    dispatch(updateFindTaskFilter(payload));
  };
  const handleSubmit = (data) => {
    let payload = {
      budget_object: budget.length !== 0 ? budget : null, //
      zip_code: parseInt(data.zip_Code),
      task_with_no_bid: AllOptions["Tasks with no bids"] === 1 ? 1 : 0,
      remote_work: AllOptions["Remote Work"] === 1 ? 1 : 0,
      nemid_authorization: AllOptions["NemID Autorization"] === 1 ? 1 : 0,
      task_urgent: AllOptions["Urgent Task"] === 1 ? 1 : 0,
      task_for_freelance: AllOptions["Tasks for freelancer"] === 1 ? 1 : 0,
      task_for_business: AllOptions["Tasks for business"] === 1 ? 1 : 0,
      placed_bids: AllOptions["Placed Bids"] === 1 ? 1 : 0,
      page: 1,
      limit: 10, //
      category: parentCatValue, 
      sub_category: subCatValue, 
    };
    dispatch(updateFindTaskCategory({
      category: parentCatValue, 
      sub_category: subCatValue, 
    }))
  dispatch(findTask(payload));
  let pagePayload = {
    type:  "findTask",
    currentPage: {
      page: 1,
      limit:10
    }
  }
  dispatch(updatePagination(pagePayload))
  };
  const handleCategory = (value) => {
   findFilterForm.resetFields(["subCategory"])

    setParentCatValue(value);
    let sublist = idWiseSubCategories[value];
    setSubcatList(sublist);
  };
  const handleSubCategory = (value) => {
    setSubCatValue(value);
    
  };
  const handleClearAll = () => {
    dispatch(clearAll({
      payload:{
        "Placed Bids": 0,
        "Tasks for business": 0,
        "Tasks for freelancer": 0,
        "Urgent Task": 0,
        "Tasks with no bids": 0,
        "NemID Autorization": 0,
        "Remote Work": 0,
      },
      type:"findTaskFilter"
    }));
    let payload = {
      task_budget: [0, -1],
      task_with_no_bid: AllOptions["Tasks with no bids"] === 1 ? 1 : 0,
      remote_work: 0,
      nemid_authorization: 0,
      task_urgent: 0,
      task_for_freelance: 0,
      task_for_business: 0,
      placed_bids: 0,
      page: pagination.page,
      limit: pagination.limit,
    };
    dispatch(findTask(payload));
    findFilterForm.resetFields();
  };
  return (
    <>
          <Form {...formItemLayout} form={findFilterForm} name="FindFilter-Form" onFinish={handleSubmit}>

      <FilterWrapper> 
        <div className="filter-header">
          <div className="title">Filters</div>
          <span
            onClick={() => {
              props.filterRef.current.style.display = "none";
              document.body.style.overflow = "";
            }}
            className="icon-cross"
          ></span>
        </div>

        <FilterFormWrapper>
          
            <Form.Item name="select" label="Category">
              <Select placeholder="Select" onChange={handleCategory}>
                {parentCategory && parentCategory.map((x, y) => (
                  <option value={x.id}>{x.name}</option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="subCategory" label="Sub-Category">
              <Select placeholder="Select" onChange={handleSubCategory}>
                {subcatList.map((x, y) => (
                  <option value={x.id}>{x.name}</option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="zip_Code" label="Zip Code"    rules={[
                       {pattern:zipCodeRegex, message:AppConstant.FormValidation.zipcodeRequired}]}
                    >
                     <Input placeholder="Zip Code"/>
            </Form.Item>
            <Form.Item label="Radius of Search">
              <div className="distance-slider">
                <Slider
                  defaultValue={50}
                  onChange={onChanged}
                  onAfterChange={onAfterChange}
                  tooltipVisible={false}
                />
                <div className="distance-text">50 Km</div>
              </div>
            </Form.Item>
            <Form.Item name="Task_Budget" label="Task Budget">
              <div class="custom" ref={inputField}>
                <Select
                  placeholder="Select"
                  mode="multiple"
                  onChange={handleChange}
                  optionLabelProp="label"
                  getPopupContainer={() => inputField.current}
                >
                  <Option value="10kr-50kr">10Kr - 50Kr</Option>
                  <Option value="50kr-100kr">50Kr - 100Kr</Option>
                  <Option value="100kr-150kr">100Kr - 150Kr</Option>
                  <Option value="150 , 200">150Kr - 200Kr</Option>
                  <Option value="200 , 350">200Kr - 350Kr</Option>
                  <Option value="350 , 350">350Kr & more</Option>

                </Select>
              </div>
            </Form.Item>
        
        </FilterFormWrapper>

        <TaskTitle>Task Status</TaskTitle>
        {plainOptions.map((option) => (
          <div>
            <Checkbox
            className="checkboxFont"
              checked={AllOptions[option] == 1}
              value={option}
              onChange={onChange2}
            >
              {option}
            </Checkbox>
          </div>
        ))}
        <div className="filter-footer">
          <Divider />
          <Button
            className="apply-btn btn btn-border"
            htmlType="submit"
            style={{ float: "left" }}
           
          >
            apply
          </Button>
          <Button
            className="clear-btn btn btn-clear"
            style={{ float: "right" }}
            onClick={() => handleClearAll()}
          >
            clear all
          </Button>
        </div>
      </FilterWrapper>
      </Form>
    </>
  );
};

export default Filter;
