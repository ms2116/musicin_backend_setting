from dataclasses import dataclass
from os import path, environ
from typing import List

base_dir = path.dirname(path.dirname(path.dirname(path.abspath(__file__))))


@dataclass
class Config:
    """
    기본 Configuration
    """
    BASE_DIR: str = base_dir
    DB_POOL_RECYCLE: int = 900
    DB_ECHO: bool = True
    DEBUG: bool = False
    TEST_MODE: bool = False
    DB_URL: str = environ.get("DB_URL", "mysql+pymysql://yth1133:Xordlsks1!~@3.35.120.141:56647/musicin_db?charset=utf8")
    # DB_URL: str = environ.get("DB_URL", "mysql+pymysql//xordlsks1!~@13.124.133.150:56651")


@dataclass
class LocalConfig(Config):
    TRUSTED_HOSTS = ["*"]
    ALLOW_SITE = ["*"]
    DEBUG: bool = True


@dataclass
class ProdConfig(Config):
    TRUSTED_HOSTS = ["*"]
    ALLOW_SITE = ["*"]


@dataclass
class TestConfig(Config):
    DB_URL: str = environ.get("DB_URL", "mysql+pymysql://yth1133:Xordlsks1!~@3.35.120.141:56647/musicin_db?charset=utf8")
    # DB_URL: str = "DB_URL", "mysql+pymysql://musicin_db:Xordlsks1!~@localhost:3306/musicin_db?charset=utf8mb4"
    TRUSTED_HOSTS = ["*"]
    ALLOW_SITE = ["*"]
    TEST_MODE: bool = True


def conf():
    """
    환경 불러오기
    :return:
    """
    config = dict(prod=ProdConfig, local=LocalConfig, test=TestConfig)
    return config[environ.get("API_ENV", "local")]()


