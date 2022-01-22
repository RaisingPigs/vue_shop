<template>
    <div>
        <!--面包屑导航-->
        <Breadcrumb :nav-list='navList'></Breadcrumb>

        <!--主题卡片区-->
        <el-card>
            <el-row>
                <el-col align='center'>
                    <!--1. 设置echarts容器-->
                    <div id='reports_chart' style='width: 800px;height:500px;'></div>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
/*导入echarts*/
import * as echarts from 'echarts';
import _ from 'lodash';
import Breadcrumb from '@/components/Breadcrumb';

export default {
    name: 'Reports',
    components: {
        Breadcrumb
    },
    data() {
        return {
            /*头部面包屑导航*/
            navList: [
                { navName: '首页', navHref: '/home' },
                { navName: '数据统计', navHref: '/home' },
                { navName: '数据报表', navHref: '' }
            ],
            options: {
                title: {
                    text: '用户来源'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#E9EEF3'
                        }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        boundaryGap: false
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ]
            }
        };
    },
    methods: {
        /*初始化图表*/
        async echartsInit() {
            // 2. 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(document.getElementById('reports_chart'));

            /*3. 发送请求获取数据*/
            const { data: res } = await this.$http.get('reports/type/1');
            if (res.meta.status !== 200) {
                return this.$message.error({ message: '获取数据失败', center: true });
            }
            /*用lodash合并data中的options和获取到的数据*/
            const resOptions = _.merge(this.options, res.data);

            // 4. 将数据和配置项放入图表, 展示数据
            myChart.setOption(resOptions);
        }
    },
    mounted() {
        /*5. dom一挂载就初始化图表*/
        this.echartsInit();
    }
};
</script>

<style scoped>

</style>