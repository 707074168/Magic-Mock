import { get, post, put } from "../utils/fetch";

const createRule = (
  data: {
    projectId: string;
    ruleName: string;
    rulePattern: string;
    ruleMethod: string;
    requestHeader: string | any[];
    responseData: string | any[];
    ruleStatus: boolean;
  },
  config = {}
) => {
  return post("/rule/create", data, config);
};

const getRuleInfo = (
  data: {
    projectId: string;
    ruleId: string;
  },
  config = {}
) => {
  const { projectId, ruleId } = data;

  return get(`/rule/info/${projectId}/${ruleId}`, config);
};

const updateRuleInfo = (
  data: {
    projectId: string;
    ruleId: string;
    ruleInfo: any;
  },
  config = {}
) => {
  const { projectId, ruleId, ruleInfo } = data;

  return put(
    `/rule/info/${projectId}/${ruleId}`,
    {
      ruleInfo,
    },
    config
  );
};

export { createRule, getRuleInfo, updateRuleInfo };
