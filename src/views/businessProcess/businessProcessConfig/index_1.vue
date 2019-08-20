<template>
    <div>
        <el-row :gutter="2" style="margin-left:10px;margin-top:10px">
            <el-col :span="4">
                <span style="font-size: 14px;color: #606266;box-sizing: border-box;">模板列表:</span>
                <el-select v-model="process_value" placeholder="请选择" clearable>
                    <el-option v-for="item in process_template" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" round @click="addDiagram">新建流程模板</el-button>
            </el-col>
            <el-col :span="2">
                <el-button type="info" @click="printDiagram" round>打印流程模板</el-button>
            </el-col>
        </el-row>
        <el-row :gutter="2" style="margin-left:10px;margin-top:10px;margin-right:10px">
            <el-col :span="12">
                <div style="width: 100%; display: flex; justify-content: space-between">
                    <div id="myPaletteDiv" style="width: 100px; margin-right: 2px; background-color: whitesmoke; border: solid 1px black"></div>
                    <div id="myDiagramDiv" style="flex-grow: 1; height: 550px; border: solid 1px black"></div>
                </div>
                <el-row :gutter="2">
                    <el-col :span="12">
                        <el-form ref="process_form" :rules="rules" :model="process_form" label-width="120px" style="margin-top:10px;width:650px">
                            <el-form-item label="流程模板名称" prop="name">
                                <el-input v-model="process_form.name"></el-input>
                            </el-form-item>
                            <el-form-item label="流程模板说明" prop="desc">
                                <el-input type="textarea" v-model="process_form.desc"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="10" :offset="1">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>当前编辑步骤名称:<span style="color:red">{{step_name}}</span></span>
                    </div>
                    <div>
                        <el-form ref="step_form" :rules="stepRules" :model="step_form" label-width="120px">
                            <el-form-item label="主管部门" prop="corpName">
                                <el-select v-model="step_form.corpName" placeholder="请选择主管部门">
                                    <el-option v-for="item in corpList" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="负责人姓名" prop="name">
                                <el-input v-model="step_form.name"></el-input>
                            </el-form-item>
                            <el-form-item label="负责人电话" prop="tel">
                                <el-input v-model="step_form.tel"></el-input>
                            </el-form-item>
                            <el-form-item label="步骤说明" prop="desc">
                                <el-input type="textarea" v-model="step_form.desc"></el-input>
                            </el-form-item>
                            <el-button style="float: right;margin-bottom:10px" type="primary" round @click="stepServiceConfig">服务接口配置</el-button>
                            <el-table :data="serviceTableData" border style="width: 100%">
                                <el-table-column prop="apiName" label="接口服务ID列表" style="width:60%">
                                </el-table-column>
                            </el-table>
                        </el-form>
                        <el-button style="margin-top:10px" type="warning" round @click="saveCurrentStepInfo('step_form')">保存当前步骤信息</el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <el-row :gutter="1">
            <el-col :span="2" :offset="2">
                <el-button type="success"  v-if="canUpdate == true" round @click="submitProcessInfo('process_form')">保存流程模板</el-button>
            </el-col>
            <!-- <el-col :span="2" :offset="1">
                <el-button type="danger" round>清空流程模板</el-button>
            </el-col> -->
        </el-row>

        <el-dialog :title="serviceConfigTitle" :visible.sync="dialogServiceConfigFormVisible" width="550px">
            <el-transfer v-model="apiselectValue" :data="apiNameData" :titles="['所有服务列表', '需访问服务列表']"></el-transfer>
            <div slot="footer" class="dialog-footer">
                <el-button @click="submitApiNameData" type="primary">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import { getAllStepApiBaseInfo, addNewProcess, getAllProcessName, getAllProcessInfo } from '@/api/businessProcess/businessProcessConfig/index';
    import go from 'gojs';
    let $ = go.GraphObject.make;  // 后面很多用到该变量来初始化diagram
    export default {
        data() {
            return {
                diagram: null,
                palette: null,
                canUpdate: false, // 暂时关闭修改功能
                process_template: [],  // 进程模板名称列表，格式[{label:xx,value:xx},{label:xx,value:xx}]
                process_value: '',
                process_form: { // 流程模板表单信息
                    name: undefined,
                    desc: undefined
                },
                rules: { // 校验流程名称和流程说明表单
                    name: [
                        {
                            required: true,
                            message: '请输入流程名称',
                            trigger: 'blur'
                        }
                    ],
                    desc: [
                        {
                            required: true,
                            message: '请输入流程模板说明',
                            trigger: 'blur'
                        }
                    ]
                },
                process_json: {},
                // process_json: `{"class":"go.GraphLinksModel","linkFromPortIdProperty":"fromPort","linkToPortIdProperty":"toPort","nodeDataArray": [ {"key":-1, "category":"Start", "loc":"174.99999999999997 5.999999999999998", "text":"开始"},{"text":"签订合同", "key":-3, "loc":"175 94"},{"text":"办证", "key":-4, "loc":"103 178"},{"text":"办证登簿", "key":-5, "loc":"176 261"},{"text":"交税", "key":-6, "loc":"245 179"},{"category":"End", "text":"结束", "key":-7, "loc":"176.00000000000003 342.8779276556559"}],"linkDataArray": [ {"from":-1, "to":-3, "color":"blue","fromPort":"B","toPort":"T", "points":[175,27.31782991941585,175,37.31782991941585,175,52.43391495970792,175,52.43391495970792,175,67.55,175,77.55]},{"from":-3, "to":-4, "color":"blue","fromPort":"B", "toPort":"T", "points":[162.55555534362793,110.45,162.55555534362793,120.45,162.55555534362793,136,103,136,103,151.55,103,161.55]},{"from":-3, "to":-6, "color":"red","fromPort":"B", "toPort":"T", "points":[187.44444465637207,110.45,187.44444465637207,120.45,187.44444465637207,136.5,245,136.5,245,152.55,245,162.55]},{"from":-4, "to":-5, "fromPort":"B", "toPort":"T", "points":[103,194.45000000000002,103,204.45000000000002,103,219.5,163.55555534362793,219.5,163.55555534362793,234.55,163.55555534362793,244.55]},{"from":-6, "to":-5, "fromPort":"B", "toPort":"T", "points":[245,195.45000000000002,245,205.45000000000002,245,220,188.44444465637207,220,188.44444465637207,234.55,188.44444465637207,244.55]},{"from":-5, "to":-7, "fromPort":"B", "toPort":"T", "points":[176,277.45000000000005,176,287.45000000000005,176,299.50504886812007,176.00000000000003,299.50504886812007,176.00000000000003,311.56009773624015,176.00000000000003,321.56009773624015]}]}`,
                step_name: '',
                step_form: {  // 步骤配置表单
                    corpName: '', // 部门名称
                    desc: '', // 描述
                    name: '', // 负责人姓名
                    tel: '' // 负责人电话
                },
                stepRules: {
                    corpName: [
                        {
                            required: true,
                            message: '请选择主管部门',
                            trigger: 'blur'
                        }
                    ],
                    name: [
                        {
                            required: true,
                            message: '请输入姓名',
                            trigger: 'blur'
                        }
                    ],
                    tel: [
                        {
                            required: true,
                            message: '请输入负责人电话',
                            trigger: 'blur'
                        }
                    ],
                    desc: [
                        {
                            required: true,
                            message: '请输入步骤描述',
                            trigger: 'blur'
                        }
                    ]
                },
                step_form_list: [ // 步骤暂存表单 { name:'',corpName:'',desc:''}
                ],
                corpList: [
                    {
                        value: 'crop1',
                        label: '不动产登记部门'
                    }, {
                        value: 'crop2',
                        label: '房产交易部门'
                    }, {
                        value: 'crop4',
                        label: '税务部门'
                    }
                ],
                serviceTableData: [], // 步骤对应api接口表格
                dialogServiceConfigFormVisible: false,
                apiselectValue: [],
                apiNameData: [],
                serviceConfigTitle: '步骤服务配置'
            }
        },
        watch:{
            process_value:function(val, oldVal){
                this.canUpdate = false; // 禁止修改
                getAllProcessInfo(val).then(rsp=>{
                    let rsp_data = rsp.data;
                    this.process_json = rsp_data.diagramJson;
                    this.process_form = rsp_data.reqProcessForm;
                    this.step_form_list = rsp_data.stepApiRel;
                    this.load();
                })
            }
        },
        methods: {
            nodeStyle() {
                return [
                    // The Node.location comes from the "loc" property of the node data,
                    // converted by the Point.parse static method.
                    // If the Node.location is changed, it updates the "loc" property of the node data,
                    // converting back using the Point.stringify static method.
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    {
                        // the Node.location is at the center of each node
                        locationSpot: go.Spot.Center
                    }
                ];
            },
            makePort(name, align, spot, output, input) {
                var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
                // the port is basically just a transparent rectangle that stretches along the side of the node,
                // and becomes colored when the mouse passes over it
                return $(go.Shape,
                    {
                        fill: "transparent",  // changed to a color in the mouseEnter event handler
                        strokeWidth: 0,  // no stroke
                        width: horizontal ? NaN : 8,  // if not stretching horizontally, just 8 wide
                        height: !horizontal ? NaN : 8,  // if not stretching vertically, just 8 tall
                        alignment: align,  // align the port on the main Shape
                        stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
                        portId: name,  // declare this object to be a "port"
                        fromSpot: spot,  // declare where links may connect at this port
                        fromLinkable: output,  // declare whether the user may draw links from here
                        toSpot: spot,  // declare where links may connect at this port
                        toLinkable: input,  // declare whether the user may draw links to here
                        cursor: "pointer",  // show a different cursor to indicate potential link point
                        mouseEnter: function (e, port) {  // the PORT argument will be this Shape
                            if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
                        },
                        mouseLeave: function (e, port) {
                            port.fill = "transparent";
                        }
                    });
            },
            textStyle() {
                return {
                    font: "bold 11pt Helvetica, Arial, sans-serif",
                    stroke: "whitesmoke"
                }
            },
            showLinkLabel(e) {
                var label = e.subject.findObject("LABEL");
                if (label !== null) label.visible = (e.subject.fromNode.data.category === "Conditional");
            },
            load() {
                // this.diagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
                this.diagram.model = go.Model.fromJson(this.process_json);
            },
            save() {
                // document.getElementById("mySavedModel").value = this.diagram.model.toJson();
                this.process_json = this.diagram.model.toJson();
                this.diagram.isModified = false;
            },
            // 新增流程模板
            addDiagram() {
                this.canUpdate = true; // 显示保存按钮
                // 清空模板名称列表
                // this.process_template = [];
                this.process_value = '';
                // 清空流程图json
                this.process_json = {};
                this.load();
                // 清空流程模板表单信息
                this.resetProcessForm();
                // 清空每个流程步骤对应的信息
                this.resetStepForm();
                this.serviceTableData = [];
                this.step_form_list = [];
            },
            // 打印流程模板
            printDiagram() {
                var svgWindow = window.open();
                if (!svgWindow) return;  // failure to open a new Window
                var printSize = new go.Size(700, 960);
                var bnds = this.diagram.documentBounds;
                var x = bnds.x;
                var y = bnds.y;
                while (y < bnds.bottom) {
                    while (x < bnds.right) {
                        var svg = this.diagram.makeSVG({ scale: 1.0, position: new go.Point(x, y), size: printSize });
                        svgWindow.document.body.appendChild(svg);
                        x += printSize.width;
                    }
                    x = bnds.x;
                    y += printSize.height;
                }
                // setTimeout(function () { svgWindow.print(); }, 1);
            },
            // 保存当前步骤信息
            saveCurrentStepInfo(formName) {
                this.$refs[formName].validate((valid) => { // 校验表单
                    if (valid) {
                        let update_info = 0; // 0--新增 1--修改
                        if (this.step_name.text != '开始' && this.step_name.text != '结束') {
                            for (let index = 0; index < this.step_form_list.length; index++) { // 查询是否填写过该步骤对应的信息
                                const element = this.step_form_list[index];
                                if (element.name == this.step_name) {
                                    element.name = this.step_form.name;
                                    element.tel = this.step_form.tel;
                                    element.corpName = this.step_form.corpName;
                                    element.desc = this.step_form.desc;
                                    element.apiList = this.serviceTableData;
                                    update_info = 1;
                                    break;
                                }
                            }
                            if (update_info == 0) { // 新增
                                this.step_form_list.push({ stepName: this.step_name, name: this.step_form.name, tel: this.step_form.tel, corpName: this.step_form.corpName, desc: this.step_form.desc, apiList: this.serviceTableData });
                            }
                        } else {
                            this.$alert("开始或结束步骤不需要配置", "提示", {
                                confirmButtonText: "确定"
                            });
                        }
                        this.$alert("保存当前步骤信息成功", "提示", {
                            confirmButtonText: "确定"
                        });
                    }
                });
            },
            // 服务接口配置
            stepServiceConfig() {
                this.apiNameData = [];
                this.apiselectValue = [];
                this.dialogServiceConfigFormVisible = true;
                // 查询所有服务
                getAllStepApiBaseInfo().then(rsp => {
                    let rsp_data = rsp.data;
                    for (let index = 0; index < rsp_data.length; index++) {
                        const element = rsp_data[index];
                        this.apiNameData.push({ key: element.apiPubkey, label: element.apiName });
                    }
                });
            },
            // 提交服务列表配置
            submitApiNameData() {
                this.serviceTableData = [];
                for (let index = 0; index < this.apiselectValue.length; index++) {
                    const element = this.apiselectValue[index];
                    for (let j = 0; j < this.apiNameData.length; j++) {
                        let api_element = this.apiNameData[j];
                        if (element == api_element.key) {
                            this.serviceTableData.push({ apiId: api_element.key, apiName: api_element.label });
                        }
                    }
                }
                this.dialogServiceConfigFormVisible = false;
            },
            // 保存流程模板信息
            submitProcessInfo(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // 保存流程图json
                        this.save();
                        // 获取流程图json
                        let diagram_json = this.process_json;
                        // 获取步骤信息及对应的apiId列表
                        let step_api_rel = this.step_form_list;
                        // 获取流程信息
                        let req_process_form = this.process_form;
                        // 封装结果
                        let submit_json = { diagramJson: diagram_json, stepApiRel: step_api_rel, reqProcessForm: req_process_form };
                        addNewProcess(submit_json).then(rsp => {
                            let status = rsp.status;
                            if (status == 200) { // 添加成功
                                this.$alert("保存模板信息成功", "提示", {
                                    confirmButtonText: "确定"
                                });
                            } else { // 添加失败
                                this.$alert("保存模板信息失败", "提示", {
                                    confirmButtonText: "确定"
                                });
                            }
                        });
                    }
                });
            },
            // 清空流程模板表单信息
            resetProcessForm() {
                this.process_form = {
                    name: undefined,
                    desc: undefined
                };
            },
            // 清空步骤表单
            resetStepForm() {
                this.step_name = '';
                this.step_form = {  // 步骤配置表单
                    corpName: '', // 部门名称
                    desc: '', // 描述
                    name: '', // 负责人姓名
                    tel: '' // 负责人电话
                }
            }
        },
        mounted() {
            let myDiagram =
                $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
                    {
                        initialContentAlignment: go.Spot.Center,
                        allowDrop: true,  // must be true to accept drops from the Palette
                        "LinkDrawn": (e) => {
                            var label = e.subject.findObject("LABEL");
                            if (label !== null) label.visible = (e.subject.fromNode.data.category === "Conditional");
                        },  // this DiagramEvent listener is defined below
                        "LinkRelinked": (e) => {
                            var label = e.subject.findObject("LABEL");
                            if (label !== null) label.visible = (e.subject.fromNode.data.category === "Conditional");
                        },
                        scrollsPageOnFocus: false,
                        "undoManager.isEnabled": true,  // enable undo & redo
                        "ObjectSingleClicked": (e) => {
                            let obj = e.subject;
                            // 清空每个步骤对应的表单信息
                            this.step_name = ''; // 步骤名称
                            this.step_form.name = ''; // 负责人姓名
                            this.step_form.tel = ''; // 联系电话
                            this.step_form.corpName = ''; // 主管部门
                            this.step_form.desc = ''; // 步骤说明
                             // console.log(e.subject.part.data.key);
                            if (e.subject.text == '开始' || e.subject.text == '结束') {
                                // 表单无效化

                            } else {
                                this.step_name = obj.text;// 更改步骤名称
                                this.serviceTableData = [];
                                for (let index = 0; index < this.step_form_list.length; index++) { // 查询是否填写过该步骤对应的信息
                                    const element = this.step_form_list[index];
                                    if (element.stepName == e.subject.text) { // 填写过步骤对应表单
                                        this.step_form.name = element.name;
                                        this.step_form.tel = element.tel;
                                        this.step_form.corpName = element.corpName;
                                        this.step_form.desc = element.desc;
                                        for (let j = 0; j < this.step_form_list[index].apiList.length; j++) {
                                            let element_api = this.step_form_list[index].apiList[j];
                                            this.serviceTableData.push({ apiId: element_api.apiId, apiName: element_api.apiName });
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    });
            // when the document is modified, add a "*" to the title and enable the "Save" button
            myDiagram.addDiagramListener("Modified", function (e) {
                var button = document.getElementById("SaveButton");
                if (button) button.disabled = !myDiagram.isModified;
                var idx = document.title.indexOf("*");
                if (myDiagram.isModified) {
                    if (idx < 0) document.title += "*";
                } else {
                    if (idx >= 0) document.title = document.title.substr(0, idx);
                }
            });
            myDiagram.nodeTemplateMap.add("",  // the default category
                $(go.Node, "Table", this.nodeStyle(),
                    // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                    $(go.Panel, "Auto",
                        $(go.Shape, "Rectangle",
                            { fill: "#00A9C9", strokeWidth: 0 },
                            new go.Binding("figure", "figure")),
                        $(go.TextBlock, this.textStyle(),
                            {
                                margin: 8,
                                maxSize: new go.Size(160, NaN),
                                wrap: go.TextBlock.WrapFit,
                                editable: true
                            },
                            new go.Binding("text").makeTwoWay())
                    ),
                    // four named ports, one on each side:
                    this.makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
                    this.makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
                    this.makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
                    this.makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, false)
                ));
            myDiagram.nodeTemplateMap.add("Conditional",
                $(go.Node, "Table", this.nodeStyle(),
                    // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                    $(go.Panel, "Auto",
                        $(go.Shape, "Diamond",
                            { fill: "#00A9C9", strokeWidth: 0 },
                            new go.Binding("figure", "figure")),
                        $(go.TextBlock, this.textStyle(),
                            {
                                margin: 8,
                                maxSize: new go.Size(160, NaN),
                                wrap: go.TextBlock.WrapFit,
                                editable: true
                            },
                            new go.Binding("text").makeTwoWay())
                    ),
                    // four named ports, one on each side:
                    this.makePort("T", go.Spot.Top, go.Spot.Top, false, true),
                    this.makePort("L", go.Spot.Left, go.Spot.Left, true, true),
                    this.makePort("R", go.Spot.Right, go.Spot.Right, true, true),
                    this.makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
                ));
            myDiagram.nodeTemplateMap.add("Start",
                $(go.Node, "Table", this.nodeStyle(),
                    $(go.Panel, "Auto",
                        $(go.Shape, "Circle",
                            { minSize: new go.Size(40, 40), fill: "#79C900", strokeWidth: 0 }),
                        $(go.TextBlock, "Start", this.textStyle(), { editable: false },
                            new go.Binding("text").makeTwoWay())
                    ),
                    // three named ports, one on each side except the top, all output only:
                    this.makePort("L", go.Spot.Left, go.Spot.Left, true, false),
                    this.makePort("R", go.Spot.Right, go.Spot.Right, true, false),
                    this.makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
                ));
            myDiagram.nodeTemplateMap.add("End",
                $(go.Node, "Table", this.nodeStyle(),
                    $(go.Panel, "Auto",
                        $(go.Shape, "Circle",
                            { minSize: new go.Size(40, 40), fill: "#DC3C00", strokeWidth: 0 }),
                        $(go.TextBlock, "End", this.textStyle(), { editable: false },
                            new go.Binding("text").makeTwoWay())
                    ),
                    // three named ports, one on each side except the bottom, all input only:
                    this.makePort("T", go.Spot.Top, go.Spot.Top, false, true),
                    this.makePort("L", go.Spot.Left, go.Spot.Left, false, true),
                    this.makePort("R", go.Spot.Right, go.Spot.Right, false, true)
                ));
            myDiagram.nodeTemplateMap.add("Comment",
                $(go.Node, "Auto", this.nodeStyle(),
                    $(go.Shape, "File",
                        { fill: "#EFFAB4", strokeWidth: 0 }),
                    $(go.TextBlock, this.textStyle(),
                        {
                            margin: 5,
                            maxSize: new go.Size(200, NaN),
                            wrap: go.TextBlock.WrapFit,
                            textAlign: "center",
                            editable: true,
                            font: "bold 12pt Helvetica, Arial, sans-serif",
                            stroke: '#454545'
                        },
                        new go.Binding("text").makeTwoWay())
                    // no ports, because no links are allowed to connect with a comment
                ));
            // replace the default Link template in the linkTemplateMap
            myDiagram.linkTemplate =
                $(go.Link,  // the whole link panel
                    {
                        routing: go.Link.AvoidsNodes,
                        curve: go.Link.JumpOver,
                        corner: 5, toShortLength: 4,
                        relinkableFrom: true,
                        relinkableTo: true,
                        reshapable: true,
                        resegmentable: true,
                        // mouse-overs subtly highlight links:
                        mouseEnter: function (e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },
                        mouseLeave: function (e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; },
                        selectionAdorned: false
                    },
                    new go.Binding("points").makeTwoWay(),
                    $(go.Shape,  // the highlight shape, normally transparent
                        { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
                    $(go.Shape,  // the link path shape
                        { isPanelMain: true, stroke: "gray", strokeWidth: 2 },
                        new go.Binding("stroke", "isSelected", function (sel) { return sel ? "dodgerblue" : "gray"; }).ofObject(), new go.Binding("stroke", "color")),
                    $(go.Shape,  // the arrowhead
                        { toArrow: "standard", strokeWidth: 0, fill: "gray" }, new go.Binding("fill", "color")),
                    $(go.Panel, "Auto",  // the link label, normally not visible
                        { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5 },
                        new go.Binding("visible", "visible").makeTwoWay(),
                        $(go.Shape, "RoundedRectangle",  // the label shape
                            { fill: "#F8F8F8", strokeWidth: 0 }),
                        $(go.TextBlock, "Yes",  // the label
                            {
                                textAlign: "center",
                                font: "10pt helvetica, arial, sans-serif",
                                stroke: "#333333",
                                editable: true
                            },
                            new go.Binding("text").makeTwoWay())
                    ),
                );
            // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
            myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
            myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;
            // initialize the Palette that is on the left side of the page
            let myPalette =
                $(go.Palette, "myPaletteDiv",  // must name or refer to the DIV HTML element
                    {
                        scrollsPageOnFocus: false,
                        nodeTemplateMap: myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
                        model: new go.GraphLinksModel([  // specify the contents of the Palette
                            { category: "Start", text: "开始" },
                            { text: "步骤" },
                            // { category: "Conditional", text: "???" },
                            { category: "End", text: "结束" }
                            // { category: "Comment", text: "注释" }
                        ])
                    });
            this.diagram = myDiagram;
            this.palette = myPalette;
            // this.load();  // load an initial diagram from some JSON text

            // 获取模板列表
            getAllProcessName().then(rsp=>{
                let rsp_data = rsp;
                this.process_template = [];
                for (let index = 0; index < rsp_data.length; index++) {
                    const element = rsp_data[index];
                    this.process_template.push({label:element.procName,value:element.pid});
                }
            });

        }
    }

</script>