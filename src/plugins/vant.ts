import { App as VM } from 'vue'
import {
    Button,
    List,
    Cell,
    Tab,
    Tabs,
    Icon,
    Image,
    Checkbox,
    CheckboxGroup,
    Field,
    Uploader,
    CellGroup,
    Calendar,
    DatetimePicker,
    Popup,
    Picker,
    Col,
    Row,
    Toast,
    Notify,
    PullRefresh,
} from 'vant'

const plugins = [
    Button,
    List,
    Cell,
    Tab,
    Tabs,
    Icon,
    Image,
    Checkbox,
    CheckboxGroup,
    Field,
    Uploader,
    CellGroup,
    Calendar,
    DatetimePicker,
    Popup,
    Picker,
    Col,
    Row,
    Toast,
    Notify,
    PullRefresh,
]

export const vantPlugins = {
    install: function (vm: VM) {
        plugins.forEach((item) => {
            vm.component(item.name, item)
        })
    },
}
