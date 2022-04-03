import shutil
import os

# get documents that we want to query
dirname = os.path.dirname(__file__)
page_dir = "../pages"
page_dir = os.path.join(dirname, page_dir)
doc_dir = os.path.join(dirname, 'doc_dir')

try:
    shutil.rmtree(doc_dir)
except Exception as e:
    print(e)


# copy and rename file to .txt
for dirName, subdirList, fileList in os.walk(page_dir):
    # print('Found directory: %s' % os.path.basename(dirName))
    for fname in fileList:
        # print('\t%s' % fname)
        if fname.endswith(".md"):
            src = os.path.join(dirName, fname)
            dst_dir = os.path.join(doc_dir, os.path.basename(dirName))
            # pre, ext = os.path.splitext(fname)
            dst = os.path.join(dst_dir, fname)  # pre + '.txt')
            if not os.path.exists(dst_dir):
                os.makedirs(dst_dir)
            shutil.copyfile(src, dst)
