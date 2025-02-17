import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Button from '../ui/Button';
export default function CustomerActions({ isEditing, onCancel, onSave }) {
    if (!isEditing)
        return null;
    return (_jsxs("div", { className: "flex justify-end gap-3", children: [_jsx(Button, { variant: "secondary", onClick: onCancel, children: "\u0625\u0644\u063A\u0627\u0621" }), _jsx(Button, { onClick: onSave, children: "\u062D\u0641\u0638" })] }));
}
