import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Spin, Divider, InputNumber, Select } from 'antd';
import { API_URL } from '../../config/config'; // 确保 API_URL 正确配置
const { TextArea } = Input;

const SettingPage = () => {
    const [loading, setLoading] = useState(true);
    // const [configData, setConfigData] = useState({}); // 注释掉通用配置状态
    // const [form] = Form.useForm(); // 注释掉通用配置表单实例
    // 新增：关于信息状态
    const [aboutInfo, setAboutInfo] = useState({ 
        tooltipContent: '', 
        version: '', 
        copyright: '', 
        additionalInfo: { developer: '', website: '' } 
    });
    const [aboutForm] = Form.useForm(); // 为关于信息创建新的表单实例

    // 获取通用配置数据 - 注释掉
    // useEffect(() => {
    //     fetch(`${API_URL}/getConfigData`)
    //         .then(response => response.json())
    //         .then(data => {
    //             setConfigData(data);
    //             form.setFieldsValue(data);
    //         })
    //         .catch(error => console.error('获取配置数据失败:', error))
    //         .finally(() => setLoading(false));
    // }, [form]);

    // 新增：获取关于信息数据
    useEffect(() => {
        setLoading(true); // 在这里开始 loading
        fetch(`${API_URL}/getAboutInfo`)
            .then(response => response.json())
            .then(data => {
                // 确保 additionalInfo 存在且为对象
                if (data && typeof data.additionalInfo !== 'object') {
                    data.additionalInfo = { developer: '', website: '' };
                }
                setAboutInfo(data);
                // 使用 setFieldsValue 设置关于信息表单的初始值
                aboutForm.setFieldsValue({
                    ...data,
                    developer: data.additionalInfo?.developer,
                    website: data.additionalInfo?.website,
                });
            })
            .catch(error => {
                 console.error('获取关于信息失败:', error);
                 message.error('加载关于信息失败');
             })
            .finally(() => setLoading(false)); // 在这里结束 loading
    }, [aboutForm]);

    // 保存通用配置数据 - 注释掉
    // const handleSaveConfig = (values) => {
    //     setLoading(true);
    //     fetch(`${API_URL}/saveConfigData`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(values),
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         message.success('配置保存成功');
    //         setConfigData(data);
    //     })
    //     .catch(error => {
    //         console.error('保存配置失败:', error);
    //         message.error('保存配置失败');
    //     })
    //     .finally(() => setLoading(false));
    // };
    
    // 新增：保存关于信息数据
    const handleSaveAboutInfo = (values) => {
        setLoading(true);
        // 构造符合 about.json 格式的对象
        const aboutDataToSave = {
            tooltipContent: values.tooltipContent,
            version: values.version,
            copyright: values.copyright,
            additionalInfo: {
                developer: values.developer,
                website: values.website,
            }
        };
        
        fetch(`${API_URL}/updateAboutInfo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(aboutDataToSave),
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                message.success(data.message || '关于信息保存成功');
                // 更新状态以反映保存后的数据（如果后端返回了更新后的数据）
                // 假设后端返回的 data.data 是更新后的完整 aboutInfo 对象
                if (data.data) {
                     // 确保 additionalInfo 结构正确
                     if (data.data && typeof data.data.additionalInfo !== 'object') {
                        data.data.additionalInfo = { developer: '', website: '' };
                     }
                     setAboutInfo(data.data);
                     // 同时更新表单显示的值
                     aboutForm.setFieldsValue({
                        ...data.data,
                        developer: data.data.additionalInfo?.developer,
                        website: data.data.additionalInfo?.website,
                     });
                }
            } else {
                message.error(data.message || '保存关于信息失败');
            }
        })
        .catch(error => {
            console.error('保存关于信息失败:', error);
            message.error('保存关于信息失败，请查看控制台日志');
        })
        .finally(() => setLoading(false));
    };

    return (
        <Spin spinning={loading}>
            {/* 系统通用设置 Card - 已注释
            <Card title="系统通用设置">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSaveConfig}
                    initialValues={configData} // 确保表单初始值设置正确
                >
                    <Form.Item name="DIFY_API_URL" label="Dify API URL" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="DIFY_TIMEOUT" label="Dify 请求超时 (ms)" rules={[{ required: true, type: 'number' }]}>
                        <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item name="DIFY_APP_GENERIC_API_KEY" label="Dify 通用 App API Key (可选)">
                        <Input.Password placeholder="如果配置，将作为应用的默认Key"/>
                    </Form.Item>
                    <Form.Item name="DIFY_APP_GENERIC_API_URL" label="Dify 通用 App API URL (可选)">
                        <Input placeholder="如果配置，将作为应用的默认URL，覆盖通用URL"/>
                    </Form.Item>
                     <Form.Item name="WHITE_LIST_CHECK_INTERVAL" label="白名单检查间隔 (ms)" rules={[{ required: true, type: 'number' }]}>
                        <InputNumber style={{ width: '100%' }} min={1000}/>
                    </Form.Item>
                    <Form.Item name="APP_UPDATE_INTERVAL" label="应用列表刷新间隔 (ms)" rules={[{ required: true, type: 'number' }]}>
                        <InputNumber style={{ width: '100%' }} min={5000}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            保存通用设置
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            <Divider />
            */}
            
            {/* 关于信息配置卡片 - 保持显示 */}
            <Card title="关于信息配置">
                <Form
                    form={aboutForm} // 使用独立的表单实例
                    layout="vertical"
                    onFinish={handleSaveAboutInfo}
                    initialValues={{
                        ...aboutInfo,
                        developer: aboutInfo.additionalInfo?.developer,
                        website: aboutInfo.additionalInfo?.website,
                    }} // 确保在数据加载后设置初始值
                >
                    <Form.Item name="tooltipContent" label="悬停提示内容 (Tooltip)" rules={[{ required: true }]}>
                        <TextArea rows={3} placeholder="支持换行，例如：第一行\n第二行"/>
                    </Form.Item>
                    <Form.Item name="version" label="版本号" rules={[{ required: true }]}>
                        <Input placeholder="例如：v1.0.1"/>
                    </Form.Item>
                    <Form.Item name="copyright" label="版权信息" rules={[{ required: true }]}>
                        <Input placeholder="例如：© 2024 Your Organization"/>
                    </Form.Item>
                     <Form.Item name="developer" label="开发者/组织">
                        <Input placeholder="例如：智能系统实验室"/>
                    </Form.Item>
                    <Form.Item name="website" label="相关网站 URL">
                        <Input placeholder="例如：https://example.com"/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            保存关于信息
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Spin>
    );
};

export default SettingPage;