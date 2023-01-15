
precision lowp float;
uniform bool isSelected;
out vec4 finalColor;
void main() {
    if(!isSelected)
        finalColor = vec4(0., 5., .0, .75);
    else
        finalColor = vec4(1., 1., .0, .75);
}