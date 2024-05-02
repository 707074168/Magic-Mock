import { Button, Card, Dropdown, Menu, Tag, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  PoweroffOutlined,
  EditOutlined,
  UnorderedListOutlined,
  ChromeOutlined,
} from "@ant-design/icons";
import { useData } from "../../../context";
import { get, post } from "../../../utils/fetch";
import { FolderAPI, ProjectAPI } from "../../../api";
import { IDialogInfo, IFormRefProps } from "../../../types/dialog";
import AddProjectForm from "../../../components/add-project-form";
import { useNavigate } from "../../../hooks/navigate";
import RightClickMenu from "../../../components/right-click-menu";

const HomeDetail: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const { openDialog, updateDialogInfo, refresh, setRefresh, closeDialog } =
    useData();
  const [projectData, setProjectData] = useState([]);
  const [loadings, setLoadings] = useState<any>({});
  const formRef = useRef<IFormRefProps>();

  const handleChangeStatus = useCallback(
    async (project: any, status: boolean) => {
      setLoadings((oldValue: any) => ({
        ...oldValue,
        [project.name]: status,
      }));

      const fn = status ? ProjectAPI.startProject : ProjectAPI.stopProject;

      fn({
        name: project.name,
        url: project.url,
      })
        .then((res) => {
          console.log(res);
        })
        .finally(() => {
          setLoadings((oldValue: any) => ({
            ...oldValue,
            [project.name]: false,
          }));
          setRefresh();
        });
    },
    [setRefresh]
  );

  const handleEditDialog = useCallback(
    (
      data = {
        name: "",
        url: "",
      }
    ) => {
      const info: IDialogInfo<IFormRefProps | undefined> = {
        title: "Add Project",
        content: (
          <AddProjectForm
            data={{
              projectName: data.name,
              projectUrl: data.url,
            }}
            ref={formRef}
          />
        ),
        ref: formRef,
        handleConfirm: () => {
          info.ref?.current
            ?.onValidate()
            .then(
              async (formValue: {
                projectName: string;
                projectUrl: string;
              }) => {
                await FolderAPI.updateFolder({
                  pathname: data.name,
                  name: formValue.projectName,
                  url: formValue.projectUrl,
                });
                setRefresh();
                info.ref?.current?.onReset();
                closeDialog?.();
              }
            )
            .catch((err: any) => console.log(err));
        },
        handleClose: () => {
          info.ref?.current?.onReset();
        },
      };
      updateDialogInfo?.(info);
      openDialog?.();
    },
    [closeDialog, openDialog, setRefresh, updateDialogInfo, projectData]
  );

  useEffect(() => {
    FolderAPI.getFolderInfo().then((res: any) => {
      // setLoadings(res.project?.map(() => false))
      setProjectData(res.project);
    });
  }, [refresh]);

  const handleMenuClick = (e: any) => {
    console.log("点击了菜单项", e);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">菜单项1</Menu.Item>
      <Menu.Item key="2">菜单项2</Menu.Item>
      <Menu.Item key="3">菜单项3</Menu.Item>
    </Menu>
  );

  const CardTitle = useCallback((item: any) => {
    return (
      <>
        <span>{item.name}</span>
        <Tag
          color={item.status ? "success" : "default"}
          style={{ marginLeft: "10px" }}
        >
          <span>{item.status ? "在线" : "离线"}</span>
        </Tag>
        <span style={{ color: "rgba(0, 0, 0, .5)" }}>{item.timer}</span>
      </>
    );
  }, []);

  return (
    <Content
      style={{
        padding: 24,
        margin: 0,
        minHeight: 280,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      {projectData?.map((item: any, index) => {
        return (
          <Card
            key={item.id}
            hoverable
            style={{ marginBottom: 16 }}
            styles={{
              body: { padding: "10px 24px" },
              extra: {
                position: "absolute",
                right: "24px",
                zIndex: 99,
              },
            }}
            title={CardTitle(item)}
            onClick={() => navigate(`/detail/${item.name}`)}
            extra={
              <>
                <Button
                  onClick={() => handleEditDialog(item)}
                  icon={<EditOutlined />}
                  style={{ marginRight: "20px" }}
                />
                <Button
                  danger={item.status ? true : false}
                  type="primary"
                  icon={<PoweroffOutlined />}
                  loading={loadings[item.name]}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChangeStatus(item, !item.status);
                  }}
                >
                  {item.status ? "Stop" : "Start"}
                </Button>
              </>
            }
          >
            <RightClickMenu item={item} />
            <div style={{ marginBottom: "10px" }}>
              <ChromeOutlined style={{ marginRight: "10px" }} />
              <span>{item.url}</span>
            </div>
            <div>
              <UnorderedListOutlined style={{ marginRight: "10px" }} />
              <span>12 Rules</span>{" "}
            </div>
          </Card>
        );
      })}
    </Content>
  );
};

export default HomeDetail;
