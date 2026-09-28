/**
 * https://github.com/atmulyana/expressCartMobile
 */
import {
    useForm,
    useLang,
    useMount,
    useRefCallback,
    useStyles
} from "@/hooks";
import type { SubmitFunction } from "@/types";
import {
    emptyString,
    noop
} from 'javascript-common';
import React from 'react';
import {
    Pressable,
    Modal as RNModal,
    ScrollView,
    type StyleProp,
    View,
    type ViewStyle
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Button from '../Button';
import Icon from '../Icon';
import Notification from '../Notification';
import Text from '../Text';

const Modal = React.memo(function Modal({
    animationType = "fade",
    buttonDone,
    cancelLabel,
    onSubmit = noop,
    style,
    supportedOrientations = ['landscape', 'portrait'],
    title = emptyString,
    toggled = false,
    ...props
}: Omit<React.ComponentProps<typeof RNModal>, 'visible'> & {
    buttonDone?: React.ReactElement | ((submit: SubmitFunction) => React.ReactElement) | string,
    cancelLabel?: string,
    onSubmit?: (submit: SubmitFunction, hide: () => void) => void,
    style?: StyleProp<ViewStyle>,
    title?: string,
    toggled?: boolean,
}) {
    const [Form, doSubmit] = useForm();
    const lang = useLang();
    const mounted = React.useRef(false);
    const styles = useStyles();
    const [visible, setVisible] = React.useState(toggled);
    
    const hide = useRefCallback(() => setVisible(false));
    const submit = React.useCallback(() => onSubmit(doSubmit, hide), [onSubmit, hide, doSubmit]);

    React.useEffect(() => {
        if (mounted.current) setVisible(visible => !visible);
    }, [toggled]);
    useMount(() => {
        mounted.current = true;
    });

    return <RNModal
        animationType={animationType}
        hardwareAccelerated={props.hardwareAccelerated}
        onDismiss={props.onDismiss}
        onOrientationChange={props.onOrientationChange}
        onRequestClose={hide}
        onShow={props.onShow}
        presentationStyle={props.presentationStyle}
        statusBarTranslucent={props.statusBarTranslucent}
        supportedOrientations={supportedOrientations}
        transparent
        visible={visible}
    >
        <SafeAreaView style={styles.array('flex1', 'stretch')}>
        <View style={styles.array('flex1', 'stretch', 'contentCentered')}>
            <Pressable style={styles.array<ViewStyle>('modalBackdrop', 'fill')} onPress={hide} />

            <Form style={[styles.modal, style]}>
                <View style={styles.array('flexRow', 'p8', 'bb')}>
                    <Text style={styles.array('textLarge', 'textBold', 'flex1')}>{title}</Text>
                    <Icon name="x" size={16} onPress={hide} />
                </View>
                <ScrollView style={styles.array('flex1', 'p8')}>
                    {props.children}
                </ScrollView>
                <View style={styles.array('flexRow', 'justifyBetween', 'p8', 'bt')}>
                    {cancelLabel || cancelLabel === undefined
                        ? <Button
                            style={styles.get('btn-outline-danger')}
                            pressedStyle={styles.get('btn-danger')}
                            onPress={hide}
                          >{cancelLabel ?? lang('Cancel')}</Button>
                        : null
                    }
                    {
                        typeof(buttonDone) == 'string'
                            ? <Button
                                style={styles.get('btn-outline-success')}
                                pressedStyle={styles.get('btn-success')}
                                onPress={submit}
                              >{buttonDone}</Button> :
                        typeof(buttonDone) == 'function'
                            ? buttonDone(doSubmit) :
                        buttonDone
                            ? buttonDone :
                        null
                    }
                </View>
            </Form>

            <Notification /> 
        </View>
        </SafeAreaView>
    </RNModal>
});
export default Modal;