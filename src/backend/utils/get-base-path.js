module.exports = function getBasePath(os, path) {
    return os.homedir() + path.sep + "ProjectionEngineProjects" + path.sep
}