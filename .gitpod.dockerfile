FROM gitpod/workspace-base:latest

### Terminal Setup ###
RUN ["sudo", "apt-get", "update"]

## Install Python ###
USER gitpod
# Dazzle does not rebuild a layer until one of its lines are changed. Increase this counter to rebuild this layer.
ENV TRIGGER_REBUILD=1

RUN sudo install-packages python3-pip

ENV PATH=$HOME/.pyenv/bin:$HOME/.pyenv/shims:$PATH
RUN curl -fsSL https://github.com/pyenv/pyenv-installer/raw/master/bin/pyenv-installer | bash \
  && { echo; \
  echo 'eval "$(pyenv init -)"'; \
  echo 'eval "$(pyenv virtualenv-init -)"'; } >> /home/gitpod/.bashrc.d/60-python \
  && pyenv update \
  && pyenv install 3.6.15 \
  && pyenv global 3.6.15 \
  && python3 -m pip install --no-cache-dir --upgrade pip \
  && python3 -m pip install --no-cache-dir --upgrade \
  setuptools wheel virtualenv pipenv pylint rope flake8 \
  mypy autopep8 pep8 pylama pydocstyle bandit notebook \
  twine \
  && sudo rm -rf /tmp/*
ENV PIP_USER=no
ENV PIPENV_VENV_IN_PROJECT=true
ENV PYTHONUSERBASE=/workspace/.pip-modules
ENV PATH=$PYTHONUSERBASE/bin:$PATH

USER root

RUN mkdir -p $PYTHONUSERBASE && chown gitpod $PYTHONUSERBASE

USER gitpod

### NodeJS ###
USER gitpod
ENV NODE_VERSION=10.24.1
ENV TRIGGER_REBUILD=1
RUN curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | PROFILE=/dev/null bash \
  && bash -c ". .nvm/nvm.sh \
  && nvm install $NODE_VERSION \
  && nvm alias default $NODE_VERSION \
  && npm install -g typescript yarn node-gyp" \
  && echo ". ~/.nvm/nvm.sh"  >> /home/gitpod/.bashrc.d/50-node
ENV PATH=$PATH:/home/gitpod/.nvm/versions/node/v${NODE_VERSION}/bin

## Setting ZSH ###
RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v1.1.2/zsh-in-docker.sh)" -- \
  -t https://github.com/denysdovhan/spaceship-prompt \
  -a 'SPACESHIP_PROMPT_ADD_NEWLINE="false"' \
  -a 'SPACESHIP_PROMPT_SEPARATE_LINE="false"' \
  -a 'SPACESHIP_USER_SHOW=always' \
  -a 'SPACESHIP_CHAR_SYMBOL="❯"' \
  -a 'SPACESHIP_CHAR_SUFFIX=" "' \
  -a 'SPACESHIP_PROMPT_ORDER=( \n\
  user          # Username section \n\
  dir           # Current directory section \n\
  host          # Hostname section \n\
  git           # Git section (git_branch + git_status) \n\
  hg            # Mercurial section (hg_branch  + hg_status) \n\
  exec_time     # Execution time \n\
  line_sep      # Line break \n\
  vi_mode       # Vi-mode indicator \n\
  jobs          # Background jobs indicator \n\
  exit_code     # Exit code section \n\
  char          # Prompt character \n\
  )' \
  -p git \
  -p python \
  -p pip \
  -p nvm \
  -p yarn \
  -p https://github.com/zsh-users/zsh-autosuggestions \
  -p https://github.com/zsh-users/zsh-completions \
  -p https://github.com/zsh-users/zsh-history-substring-search \
  -p https://github.com/zsh-users/zsh-syntax-highlighting \
  -p 'history-substring-search' 

ENTRYPOINT [ "/bin/zsh" ]
CMD ["-l"]