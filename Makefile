ROOT  = ${PWD}
SRC   = ${ROOT}/src/**/*
DOCS  = ${ROOT}/doc/api
JSDOC = ${ROOT}/vendor/jsdoc-toolkit
JSDOC_TEMPLATE = ${JSDOC}/templates/jive

clean_docs:
	rm -rf ${DOCS}

docs: clean_docs
	mkdir -p ${DOCS}
	cd ${JSDOC_TEMPLATE}; java -jar ${JSDOC}/jsrun.jar ${JSDOC}/app/run.js -a -t=${JSDOC_TEMPLATE} ${SRC} -d=${DOCS}
